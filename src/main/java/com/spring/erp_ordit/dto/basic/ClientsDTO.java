package com.spring.erp_ordit.dto.basic;

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
public class ClientsDTO {
	
	private int client_code;		// 거래처 코드
    private String client_name;		// 거래처명
    private String c_ceo;		// 대표자명
    private String c_biz_num;		// 사업자 등록 번호
    private String c_tel;			// 거래처 연락처
    private String c_address;	// 거래처 주소
    private String c_type;		// 거래처 유형
    private String c_industry;	// 거래처 업종
    private String c_status;	// 사용 상태
    private String c_note;				// 적요
    private Date c_reg_date;			// 등록일

}
