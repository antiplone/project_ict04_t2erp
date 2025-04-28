package com.spring.erp_ordit.service.api;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

	// 외부 사이트(OpenWeatherMap API)에 HTTP 요청을 보내는 도구를 하나 만듬. 나중에 복잡한 방식은 WebClient 로 변경가능.
    // RestTemplate은 쉬운 동기 방식, WebClient는 빠른 비동기 방식
	private final RestTemplate restTemplate = new RestTemplate();

    private final String openWeatherApiKey = "7467d489fb6b46f917ab3607d4d3e4bc"; // 여기 직접 쓰기
    private final String city = "Seoul";	// 날씨를 조회할 기본 도시를 지정함.

    public String getTodayWeather() {
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +
                     "&appid=" + openWeatherApiKey +
                     "&units=metric&lang=kr";
        return restTemplate.getForObject(url, String.class);		// 받은 데이터를 String 형태로 그대로 리턴
    }
}
