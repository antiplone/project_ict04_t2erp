package com.spring.erp_ordit.dto.warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@AllArgsConstructor
@ToString
@Builder
public class LogisWarehouseDTO {

	private int storage_code;				// 글번호
	private String storage_name;					// 글제목
	private String storage_location;		// 글내용
	
}