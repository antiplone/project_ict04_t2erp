package com.spring.erp_ordit.dto.warehouse;

import java.sql.Date;	// 주의

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@AllArgsConstructor
@ToString
@Builder
public class LogisStockDTO {
	private int item_code;				// 품목코드
	private String item_name;			// 품목명
	private int stock_amount;			// 재고
	private int safe_stock;				// 안전재고
	private Date last_date;				// 입고일
}
