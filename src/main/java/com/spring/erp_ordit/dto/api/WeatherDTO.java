package com.spring.erp_ordit.dto.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@ToString
@Builder
public class WeatherDTO {			// 날씨 API
    private int weather_id;
    private String weather_date;         // 기준 날짜(예: 20250424) - yyyyMMdd
    private String weather_time;         // 기준 시각(예: 0200, 1100 등)
    private String weather_temperature;  // 예: "15.2"도
    private String weather_sky;          // 예: "1" (맑음), "3" (구름 많음), "4" (흐림)
    private String weather_rain_type;     // 예: "0"(없음), "1"(비), "2"(비/눈), "3"(눈)
}
