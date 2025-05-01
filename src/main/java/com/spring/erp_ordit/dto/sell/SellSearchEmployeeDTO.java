package com.spring.erp_ordit.dto.sell;

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
public class SellSearchEmployeeDTO {	// 판매_담당자 검색 DTO
	
	private int e_id; // 사원번호
	private String e_name;  // 담당자
	private String d_name; // (담당)부서

}