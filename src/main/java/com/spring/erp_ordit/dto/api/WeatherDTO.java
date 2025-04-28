package com.spring.erp_ordit.dto.api;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
public class WeatherDTO {
    private Integer weatherId;              // 자동 증가 기본키
    private LocalDate weatherDate;             // 예보 날짜 (형식: yyyy-MM-dd)
    private LocalTime weatherTime;             // 예보 시간 (형식: HH:mm:ss)
    private Double weatherTemperature;      // 온도 (소수점 둘째 자리)
    private Integer weatherRainProbability; // 강수 확률 (%)
    private Integer weatherHumidity;        // 습도 (%)
    private String weatherDescription;      // 날씨 설명 (맑음, 흐림 등)
    private LocalDateTime weatherCreatedAt;        // 생성일시 (yyyy-MM-dd HH:mm:ss)
}
