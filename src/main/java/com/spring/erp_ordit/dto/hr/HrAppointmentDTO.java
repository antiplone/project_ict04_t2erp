package com.spring.erp_ordit.dto.hr;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor		
@NoArgsConstructor
@ToString
@Builder
public class HrAppointmentDTO {

	private int appoint_id;        	   // 발령 ID
    private int e_id;              	   // 사원번호
    private String e_name;			   // 사원이름
    private String appoint_type;       // 발령 구분 (부서이동/직위변경)
    private String old_position;       // 기존 직위
    private String new_position;       // 발령 직위
    private String old_department;     // 기존 부서
    private String new_department;     // 발령 부서
    private String appoint_note;       // 비고
    private Date appoint_date;         // 발령일자
    private String e_tel;			   // 사원 전화번호
    private String d_code;			   // 부서 코드
}