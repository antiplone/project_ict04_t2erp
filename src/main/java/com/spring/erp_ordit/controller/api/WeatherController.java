package com.spring.erp_ordit.controller.api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.service.api.WeatherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/weather")
@CrossOrigin
public class WeatherController {

    private final WeatherService weatherService;

    // ➡️ 프론트엔드에서 여기만 호출하면 됨
    @GetMapping("/today")
    public String getTodayWeather() {
        return weatherService.getTodayWeather();
    }
}
