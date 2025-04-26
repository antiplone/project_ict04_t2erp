package com.spring.erp_ordit.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.api.WeatherDTO;
import com.spring.erp_ordit.service.api.WeatherService;
import com.spring.erp_ordit.service.attendance.CommuteService;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin
public class WeatherController {
	private static final Logger log = LoggerFactory.getLogger(CommuteService.class);

    @Autowired
    private WeatherService service;
    
	//  ⇒ http://localhost:8081/api/weather/test_log
    @GetMapping("/test_log")
    public void testLog() {
        WeatherDTO dto = service.getLatestWeather();
        System.out.println("🔥 날씨 응답 DTO 로그 출력:");
        System.out.println(dto);
    }

	//  http://localhost:8081/api/weather/update
    @GetMapping("/update")
    public ResponseEntity<?> updateWeather() {
    	log.info("🥱 굿모닝입니다.");
    	
    	try {
            return ResponseEntity.ok(service.fetchAndSaveWeather());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("⛔ 날씨 업데이트 실패: " + e.getMessage());
        }
    }

	//  ⇒ http://localhost:8081/api/weather/latest
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestWeather() {
    	log.info("😎 날씨를 불러오겠습니다.");

        WeatherDTO dto = service.getLatestWeather();
        if (dto == null) {
            return ResponseEntity.ok(new WeatherDTO()); // 빈 DTO 반환
        }
        return ResponseEntity.ok(dto);
    }
}