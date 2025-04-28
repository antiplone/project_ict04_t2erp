package com.spring.erp_ordit.controller.api;

import org.springframework.web.bind.annotation.*;
import com.spring.erp_ordit.service.api.WeatherService;
import lombok.RequiredArgsConstructor;

@RestController						// "서버에 요청 오면 대답하는" 역할을 한다는 표시
@RequiredArgsConstructor		// 필요한 객체(WeatherService)를 자동으로 연결해줌
@RequestMapping("/api/weather")
@CrossOrigin
public class WeatherController {
	
	// @Autowired 은 서버 실행 중 문제가 터지고, final 은 서버 실행 전에 에러를 터트려서 문제를 더 빨리, 안전하게 발견가능
    private final WeatherService weatherService;

    // http://localhost:8081/api/weather/today
    @GetMapping("/today")
    public String getTodayWeather() {
        return weatherService.getTodayWeather();
    }
}