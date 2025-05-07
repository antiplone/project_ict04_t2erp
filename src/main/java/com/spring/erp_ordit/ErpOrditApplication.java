package com.spring.erp_ordit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // 스케줄러
public class ErpOrditApplication {

	public static void main(String[] args) {
		SpringApplication.run(ErpOrditApplication.class, args);
		System.out.println("...\nExecute, ERP-Engine Ordit...");
	}

}
