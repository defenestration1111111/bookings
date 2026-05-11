package com.defenestration.bookings.airport;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.defenestration.bookings.common.GlobalExceptionHandler;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AirportController.class)
@Import(GlobalExceptionHandler.class)
class AirportControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private AirportService service;

    @Test
    void happyPathSerialisesAirportSummaries() throws Exception {
        when(service.search(eq("LHR"), anyInt())).thenReturn(List.of(summary("LHR", "London")));

        mvc.perform(get("/api/airports/search").param("q", "LHR"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].airportCode").value("LHR"))
                .andExpect(jsonPath("$[0].city").value("London"));
    }

    @Test
    void emptyQueryStillReachesService() throws Exception {
        when(service.search(eq(""), anyInt())).thenReturn(List.of());

        mvc.perform(get("/api/airports/search").param("q", ""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void defaultLimitIsTen() throws Exception {
        when(service.search(any(), eq(10))).thenReturn(List.of());

        mvc.perform(get("/api/airports/search").param("q", "anything"))
                .andExpect(status().isOk());
    }

    @Test
    void missingQReturnsProblemDetail() throws Exception {
        mvc.perform(get("/api/airports/search"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.title").exists());

        verifyNoInteractions(service);
    }

    @Test
    void limitOverMaxReturnsValidationProblem() throws Exception {
        mvc.perform(get("/api/airports/search").param("q", "x").param("limit", "999"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.errors[0].field").value("limit"));

        verifyNoInteractions(service);
    }

    @Test
    void nonIntegerLimitReturnsProblemDetail() throws Exception {
        mvc.perform(get("/api/airports/search").param("q", "x").param("limit", "abc"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON));

        verifyNoInteractions(service);
    }

    private static AirportSummary summary(String code, String city) {
        return new AirportSummary() {
            @Override
            public String getAirportCode() {
                return code;
            }

            @Override
            public String getCity() {
                return city;
            }
        };
    }
}
