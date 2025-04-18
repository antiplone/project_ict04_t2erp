package com.spring.erp_ordit.dto.attendance;

import java.sql.Date;
import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@Builder	
public class CommuteDTO {		// 근태관리-출퇴근

	private int co_list_no;			// 행 번호
	private Date co_work_date;		// 출근 시간을 찍은 날짜, 즉 오늘 날짜
	private Time co_start_time;		// 출근시간
	private Time co_end_time;		// 퇴근시간
	private Time co_total_work_time;	// 근무시간 계산(퇴근시간 - 출근시간)
	private String co_status;			// 상태(지각, 정상, 결근)
	private String co_status_note;	// 상태비고(지각이라면 왜 지각인지 작성하는 부분)
	private int e_id;						// 조인용
	private String e_name;		// 	사원명이 필요
	// DATE 이 아닌 TIME 으로 설정한 이유 : 이미 날짜를 다른 컬럼으로 저장하기도 했고, 근무 시간 비교와 계산이 쉬워짐.
}
