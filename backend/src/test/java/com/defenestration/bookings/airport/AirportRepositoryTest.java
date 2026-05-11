package com.defenestration.bookings.airport;

import static org.assertj.core.api.Assertions.assertThat;

import com.defenestration.bookings.TestcontainersConfiguration;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Import(TestcontainersConfiguration.class)
@Sql("/db/fixtures/airports_small.sql")
class AirportRepositoryTest {

    @Autowired
    private AirportRepository repository;

    private List<AirportSummary> search(String q) {
        String codeQ = q.toUpperCase(java.util.Locale.ROOT);
        boolean enableFuzzy = q.length() >= 3;
        return repository.search(q, codeQ, enableFuzzy, 10);
    }

    @Test
    void exactCodeMatchReturnsThatAirport() {
        assertThat(search("LHR")).extracting(AirportSummary::getAirportCode).containsExactly("LHR");
    }

    @Test
    void codePrefixMatchesCaseInsensitively() {
        // Case-insensitivity is the service's job (it upper-cases codeQ); this
        // test passes through the helper, so 'lh' becomes codeQ='LH' and still
        // hits LHR.
        assertThat(search("lh")).extracting(AirportSummary::getAirportCode).contains("LHR");
    }

    @Test
    void cityPrefixMatchesAllAirportsInThatCity() {
        assertThat(search("Lon")).extracting(AirportSummary::getAirportCode)
                .containsExactlyInAnyOrder("LHR", "LGW");
    }

    @Test
    void citySubstringMatchInMiddleOfName() {
        assertThat(search("oky")).extracting(AirportSummary::getAirportCode)
                .containsExactlyInAnyOrder("HND", "NRT");
    }

    @Test
    void fuzzyMatchHandlesTypo() {
        assertThat(search("Frankfrt")).extracting(AirportSummary::getAirportCode).contains("FRA");
    }

    @Test
    void shortQuerySkipsFuzzyButKeepsPrefixAndSubstring() {
        // 'Fr' has length 2 — helper sets enableFuzzy=false. Code/prefix/substring
        // tiers still apply: 'fr' is a substring of both "Frankfurt" and "San Francisco".
        assertThat(search("Fr")).extracting(AirportSummary::getAirportCode)
                .containsExactlyInAnyOrder("FRA", "SFO");
    }

    @Test
    void fuzzyKicksInOnceQueryIsLongEnough() {
        // 'Tkyo' is a 4-char typo for Tokyo — only the fuzzy tier (length ≥ 3) finds it
        // since no airport_code or city starts with or contains 'Tkyo' literally.
        assertThat(search("Tkyo")).extracting(AirportSummary::getCity).contains("Tokyo");
    }

    @Test
    void exactCodeOutranksCityPrefixWhenAmbiguous() {
        assertThat(search("LHR").get(0).getAirportCode()).isEqualTo("LHR");
    }

    @Test
    void limitClampsResultCount() {
        List<AirportSummary> top3 = repository.topByCity(3);
        assertThat(top3).hasSize(3);
        // Alphabetic by city: Amsterdam, Frankfurt, London (LHR or LGW first).
        assertThat(top3.get(0).getCity()).isEqualTo("Amsterdam");
        assertThat(top3.get(1).getCity()).isEqualTo("Frankfurt");
    }

    @Test
    void emptyQueryReturnsTopByCityAlphabetically() {
        List<AirportSummary> all = repository.topByCity(10);
        assertThat(all).hasSize(10);
        assertThat(all.get(0).getCity()).isEqualTo("Amsterdam");
    }

    @Test
    void unmatchableQueryReturnsEmpty() {
        assertThat(search("zzzqqq")).isEmpty();
    }
}
