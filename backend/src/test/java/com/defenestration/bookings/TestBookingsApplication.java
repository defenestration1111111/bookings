package com.defenestration.bookings;

import org.springframework.boot.SpringApplication;

public class TestBookingsApplication {

	public static void main(String[] args) {
		SpringApplication.from(BookingsApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
