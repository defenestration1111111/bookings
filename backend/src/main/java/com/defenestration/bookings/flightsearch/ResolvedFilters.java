package com.defenestration.bookings.flightsearch;

import java.math.BigDecimal;
import java.util.List;

public record ResolvedFilters(
        int maxStopovers,
        int maxTotalMinutes,
        int depTodMin,
        int depTodMax,
        int arrTodMin,
        int arrTodMax,
        BigDecimal priceMin,
        BigDecimal priceMax,
        List<String> allowedFareConditions,
        SortBy sort,
        int page,
        int pageSize) {

    private static final int DEFAULT_MAX_STOPOVERS = 2;
    private static final int MAX_ALLOWED_STOPOVERS = 2;
    private static final int DEFAULT_MAX_TRAVEL_HOURS = 60;
    private static final int TOD_MIN = 0;
    private static final int TOD_MAX = 1439;
    private static final BigDecimal PRICE_MIN_DEFAULT = BigDecimal.ZERO;
    private static final BigDecimal PRICE_MAX_DEFAULT = new BigDecimal("9999999.99");
    private static final SortBy SORT_DEFAULT = SortBy.PRICE_ASC;
    private static final int PAGE_DEFAULT = 0;
    private static final int PAGE_SIZE_DEFAULT = 20;
    private static final List<String> ALL_FARE_CONDITIONS =
            List.of(FareClass.ECONOMY.sqlValue(), FareClass.COMFORT.sqlValue(), FareClass.BUSINESS.sqlValue());

    public static ResolvedFilters from(FlightSearchRequest request) {
        FlightSearchFilters f = request.filters() != null
                ? request.filters()
                : new FlightSearchFilters(null, null, null, null, null, null);

        int maxStopovers = Math.min(
                f.maxStopovers() != null ? f.maxStopovers() : DEFAULT_MAX_STOPOVERS,
                MAX_ALLOWED_STOPOVERS);
        int maxTotalMinutes = (f.maxTotalTravelTimeHours() != null
                ? f.maxTotalTravelTimeHours()
                : DEFAULT_MAX_TRAVEL_HOURS) * 60;

        MinuteRange depTod = f.departureMinutesRange();
        MinuteRange arrTod = f.arrivalMinutesRange();
        PriceRange price = f.priceRange();

        List<String> fareConditions = (f.fareClasses() == null || f.fareClasses().isEmpty())
                ? ALL_FARE_CONDITIONS
                : f.fareClasses().stream().map(FareClass::sqlValue).toList();

        return new ResolvedFilters(
                maxStopovers,
                maxTotalMinutes,
                depTod != null ? depTod.min() : TOD_MIN,
                depTod != null ? depTod.max() : TOD_MAX,
                arrTod != null ? arrTod.min() : TOD_MIN,
                arrTod != null ? arrTod.max() : TOD_MAX,
                price != null ? price.min() : PRICE_MIN_DEFAULT,
                price != null ? price.max() : PRICE_MAX_DEFAULT,
                fareConditions,
                request.sortBy() != null ? request.sortBy() : SORT_DEFAULT,
                request.page() != null ? request.page() : PAGE_DEFAULT,
                request.pageSize() != null ? request.pageSize() : PAGE_SIZE_DEFAULT);
    }
}
