package com.service.quickblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync 
public class QuickblogApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickblogApplication.class, args);
	}
}
