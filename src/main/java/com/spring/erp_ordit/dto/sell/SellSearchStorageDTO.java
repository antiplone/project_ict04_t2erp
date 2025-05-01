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
public class SellSearchStorageDTO {	// 판매_창고 검색 모달 DTO
	
	private int storage_code; 		// 창고코드
	private String storage_name; 	// 창고명
}