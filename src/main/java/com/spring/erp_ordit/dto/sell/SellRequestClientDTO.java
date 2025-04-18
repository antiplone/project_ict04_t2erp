package com.spring.erp_ordit.dto.sell;


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
public class SellRequestClientDTO {
	
	private int sc_no; 				// 요청 넘버
	private String sc_client_name; 	// 거래처명
	private String sc_ceo; 			// 대표자명
	private int sc_biz_num; 		// 사업자등록번호
	private String sc_email;		// 이메일
	private String sc_tel;			// 연락처
	private String sc_address;		// 거래처 주소
	private String sc_type;			// 업태
	private String sc_industry;		// 업종
	private String sc_status;		// 승인 상태
	private String sc_note; 		// 비고
	private Date sc_date;			// 등록일

}
