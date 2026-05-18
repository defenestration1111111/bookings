package com.defenestration.bookings.seatmap.service;

import com.defenestration.bookings.flightsearch.FareClass;
import com.defenestration.bookings.seatmap.dto.AirplaneSummary;
import com.defenestration.bookings.seatmap.dto.Seat;
import com.defenestration.bookings.seatmap.dto.SeatLayout;
import com.defenestration.bookings.seatmap.dto.SeatMapResponse;
import com.defenestration.bookings.seatmap.repository.SeatMapContextRow;
import com.defenestration.bookings.seatmap.repository.SeatRow;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class SeatMapAssembler {

    private static final Pattern SEAT_NO_PATTERN = Pattern.compile("^(\\d+)([A-Z])$");

    public SeatMapResponse assemble(SeatMapContextRow ctx, List<SeatRow> rows) {
        List<Seat> seats = rows.stream().map(SeatMapAssembler::toSeat).toList();

        List<String> columns = seats.stream()
                .map(Seat::letter)
                .distinct()
                .sorted()
                .toList();

        List<String> aislesAfter = Arrays.stream(ctx.getAislesAfter())
                .sorted(Comparator.naturalOrder())
                .toList();

        return new SeatMapResponse(
                new AirplaneSummary(ctx.getAirplaneCode(), ctx.getAirplaneModel()),
                new SeatLayout(columns, aislesAfter),
                seats);
    }

    private static Seat toSeat(SeatRow row) {
        String seatNo = row.getSeatNo();
        Matcher m = SEAT_NO_PATTERN.matcher(seatNo);
        if (!m.matches()) {
            throw new IllegalStateException("Unparseable seat_no: " + seatNo);
        }
        int rowNum = Integer.parseInt(m.group(1));
        String letter = m.group(2);
        return new Seat(
                seatNo,
                rowNum,
                letter,
                FareClass.fromSql(row.getFareConditions()),
                row.getTaken(),
                row.getPrice());
    }
}
