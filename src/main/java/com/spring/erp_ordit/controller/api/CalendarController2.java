package com.spring.erp_ordit.controller.api;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
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
    
    // 일정 저장  http://localhost:8081/api/calendar/insertEvent
    @PostMapping("/insertEvent")
    public ResponseEntity<?> insertEvent(@RequestBody CalendarDTO2 dto) {
    	System.out.println("컨트롤 - 일정을 저장합니다.");
        return new ResponseEntity<>(service.insertEvent(dto), HttpStatus.CREATED);
    }

    // 일정 조회  http://localhost:8081/api/calendar/getAllEvents
    @GetMapping("/getAllEvents")
    public ResponseEntity<List<CalendarDTO2>> getAllEvents() {
    	System.out.println("");
        List<CalendarDTO2> list = service.getAllEvents();
        return ResponseEntity.ok(list);
    }
}
