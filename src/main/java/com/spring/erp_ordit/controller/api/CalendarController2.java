package com.spring.erp_ordit.controller.api;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.api.CalendarDTO2;
import com.spring.erp_ordit.service.api.CalendarService2;
import com.spring.erp_ordit.service.attendance.CommuteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class CalendarController2 {
	
    private final CalendarService2 service;

    // 2025년 공휴일 일괄 저장 => http://localhost:8081/api/calendar/insertAllHolidays (한번만 실행)
    @GetMapping("/insertAllHolidays")
    public ResponseEntity<String> insertAllHolidays() {
        int result = service.insertAllHolidaysFromGoogle();
        if (result > 0) {
            return ResponseEntity.ok("2025년 공휴일 총 " + result + "건 저장 완료!");
        } else {
            return ResponseEntity.internalServerError().body("⛔ 저장 실패!");
        }
    }
    
    // 
    @PostMapping("/insertEvent")
    public ResponseEntity<String> insertEvent(@RequestBody CalendarDTO2 dto) {
    	System.out.println("");
        int result = service.insertEvent(dto);
        if (result > 0) {
            return ResponseEntity.ok("일정 추가 성공");
        } else {
            return ResponseEntity.internalServerError().body("일정 추가 실패");
        }
    }

    @GetMapping("/getAllEvents")
    public ResponseEntity<List<CalendarDTO2>> getAllEvents() {
    	System.out.println("");
        List<CalendarDTO2> list = service.getAllEvents();
        return ResponseEntity.ok(list);
    }
}
