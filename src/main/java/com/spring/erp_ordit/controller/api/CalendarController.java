package com.spring.erp_ordit.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.api.CalendarDTO;
import com.spring.erp_ordit.service.api.CalendarService;

@RestController		// return 타입이 JSON이다.
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class CalendarController {
	@Autowired
	private CalendarService service;

	// 캘린더 리스트 ⇒ http://localhost:8081/api/calendar/getAllEvents
	@GetMapping("/calendar/getAllEvents")
	public List<CalendarDTO> getAllEvents() {
		System.out.println("▶ CalendarController - 캘린더 리스트");
        return service.getAllEvents();
	}
	
}
