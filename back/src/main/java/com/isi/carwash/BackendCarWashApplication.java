package com.isi.carwash;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendCarWashApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendCarWashApplication.class, args);
	}

}
