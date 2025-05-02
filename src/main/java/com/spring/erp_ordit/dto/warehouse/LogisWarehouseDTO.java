package com.spring.erp_ordit.dto.warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class LogisWarehouseDTO {

	private int storage_code;				// 글번호
	private String storage_name;			// 글제목
	private String storage_zone_code;             // 우편번호
	private String storage_base_address;          // 기본주소
	private String storage_detail_address;        // 상세주소
	
}