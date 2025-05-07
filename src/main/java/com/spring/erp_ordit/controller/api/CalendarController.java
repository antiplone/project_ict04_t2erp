package com.spring.erp_ordit.controller.api;

import java.util.List;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.api.CalendarDTO;
import com.spring.erp_ordit.service.api.CalendarService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {
	
    private final CalendarService service;

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
    public ResponseEntity<?> insertEvent(@RequestBody CalendarDTO dto) {
//    	System.out.println("컨트롤 - 일정을 저장합니다.");
        return new ResponseEntity<>(service.insertEvent(dto), HttpStatus.CREATED);
    }

    // 일정 조회  http://localhost:8081/api/calendar/getAllEvents
    @GetMapping("/getAllEvents")
    public ResponseEntity<List<CalendarDTO>> getAllEvents() {
//    	System.out.println("");
        List<CalendarDTO> list = service.getAllEvents();
        return ResponseEntity.ok(list);
    }
    
    // 일정 삭제  http://localhost:8081/api/calendar/deleteEvent/20
    @DeleteMapping("/deleteEvent/{cal_event_id}")
    public ResponseEntity<?> deleteEvent(@PathVariable int cal_event_id) {
//    	System.out.println("캘린더 컨트롤러");
	    int result = service.deleteEvent(cal_event_id);
	    if (result > 0) {
	        return new ResponseEntity<>("1", HttpStatus.OK);  // 삭제 성공
	    } else {
	        return new ResponseEntity<>("0", HttpStatus.NOT_FOUND);  // 삭제 실패
	    }
    }
    
	// 일정 수정(Put) ⇒ http://localhost:8081/api/calendar/updateEvent/20
	@PutMapping("/updateEvent/{cal_event_id}")
	public ResponseEntity<?> updateEvent(@PathVariable int cal_event_id, @RequestBody CalendarDTO dto) {
//    	System.out.println("캘린더 컨트롤러");
//		System.out.println("ID: " + cal_event_id);
//		System.out.println("DTO: " + dto);
		return new ResponseEntity<>(service.updateEvent(cal_event_id, dto), HttpStatus.OK);
	}
}
