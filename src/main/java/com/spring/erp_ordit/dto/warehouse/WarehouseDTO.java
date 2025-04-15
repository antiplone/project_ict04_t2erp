package com.spring.erp_ordit.dto.warehouse;

import java.sql.Date;	

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@AllArgsConstructor
@ToString
@Builder
public class WarehouseDTO {

	private int item_code;			// 품목코드
	private String item_name;		// 품목명
	private String item_standard;	// 규격
	private int stock_amount;		// 재고
	private int safe_stock;			// 안전재고
	private Date last_date;			// 입고일
	private String client_name;		// 거래처
//	private int client_code;		// 거래처 코드
	private String storage_name;			// 창고명
//	private int storage_code;		// 창고 코드
	
}

