package com.defenestration.bookings.booking;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

@Configuration
public class BookingConfig {

    @Bean
    public Clock systemUtcClock() {
        return Clock.systemUTC();
    }

    @Bean
    public TransactionTemplate bookingTransactionTemplate(PlatformTransactionManager txManager) {
        return new TransactionTemplate(txManager);
    }
}
