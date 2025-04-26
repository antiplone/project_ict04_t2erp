package com.spring.erp_ordit.dto.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@Builder
public class CalendarDTO {			// CalendarDTO
	private String title;				// 제목
    private String start;			// 
    private boolean allDay;		//
}
// 공공데이터에서 받아온 JSON을 Java 객체로 파싱하거나, React 로 전달할 때 구조화된 데이터를 사용하기 위해