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
public class HrEmpCardDTO {

	private int e_id;                         // 사원번호
	private String e_name;                    // 사원 이름
	private String e_tel;                     // 전화번호
	private String e_position;                // 직위
	private Date e_reg_date;                  // 등록일
	private String e_status;                  // 재직 상태
	private String e_email;                   // 이메일
	private Date e_birth;                     // 생년월일
	private String e_entry;                   // 입사 구분(신입/경력)
	private String e_zone_code;               // 우편번호
	private String e_base_address;            // 기본주소
	private String e_detail_address;          // 상세주소
	private String e_photo;                   // 사진
	private String e_salary_account_bank;     // 급여통장 - 은행
	private String e_salary_account_num;      // 급여통장 - 계좌번호
	private String e_salary_account_owner;    // 급여통장 - 예금주
	private String e_note;                    // 비고
	private String d_code;                    // 부서코드(외래키)
	private String d_name;					  // 부서명
}
