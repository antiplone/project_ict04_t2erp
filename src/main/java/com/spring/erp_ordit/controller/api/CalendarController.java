package com.spring.erp_ordit.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.api.CalendarDTO;
import com.spring.erp_ordit.service.api.CalendarService;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*") 
public class CalendarController {
	
	@Autowired
	private CalendarService service;

	// 캘린더 리스트 ⇒ http://localhost:8081/api/calendar/getEvents
	@GetMapping("/getEvents")
	public List<CalendarDTO> getEvents(@RequestParam String year, @RequestParam String month) {
//	    System.out.println("📅 받은 요청: ");
	    System.out.println("📅 받은 요청: " + year + "-" + month);
	    return service.getAllEvents(year, month);
	}
}