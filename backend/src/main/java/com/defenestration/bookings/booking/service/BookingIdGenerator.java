package com.defenestration.bookings.booking.service;

import java.security.SecureRandom;
import org.springframework.stereotype.Component;

@Component
public class BookingIdGenerator {

    private static final String ALNUM_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public String bookRef() {
        return randomFrom(ALNUM_UPPER, 6);
    }

    public String ticketNo() {
        StringBuilder sb = new StringBuilder(13);
        for (int i = 0; i < 13; i++) {
            sb.append((char) ('0' + RANDOM.nextInt(10)));
        }
        return sb.toString();
    }

    public String passengerId() {
        return randomFrom(ALNUM_UPPER, 10);
    }

    private static String randomFrom(String alphabet, int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(alphabet.charAt(RANDOM.nextInt(alphabet.length())));
        }
        return sb.toString();
    }
}
