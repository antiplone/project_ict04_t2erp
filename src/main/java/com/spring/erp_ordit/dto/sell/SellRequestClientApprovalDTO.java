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
public class SellRequestClientApprovalDTO {	// 판매 _ 거래처요청 결재 DTO
	
	private int sa_approval_id; 		// 결재 번호
	private int sa_request_id; 			// 요청 테이블의 요청 넘버 fk
	private int sa_e_id; 				// 결재자 사원번호
	private String sa_approval_status;	// 승인 상태
	private String sa_approval_comment; // 비고란
	private Date sa_approval_date;		// 결재 처리일

}
