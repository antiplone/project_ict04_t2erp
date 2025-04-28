package com.spring.erp_ordit.service.api;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final String apiKey = "7467d489fb6b46f917ab3607d4d3e4bc";  // 발급받은 API 키
    private final String city = "Seoul";

    public String getTodayWeather() {
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +
                     "&appid=" + apiKey +
                     "&units=metric&lang=kr";

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class); // 그대로 JSON 반환
    }
}
