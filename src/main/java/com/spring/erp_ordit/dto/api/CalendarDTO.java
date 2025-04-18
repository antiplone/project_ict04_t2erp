package com.spring.erp_ordit.dto.api;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@Builder
public class CalendarDTO {
	
	// 캘린더 open API
	private Long cal_id;
	private String cal_title;
	private LocalDate cal_start_time;
	private LocalDate cal_end_time;
}
