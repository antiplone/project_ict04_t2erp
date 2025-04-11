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
public class LogisOrderDTO {
	private int order_id;				// 주문번호
	private Date order_date;			// 발주일
	private Date delivery_date;			// 입고 예정일
	private Date shipment_order_date;	// 출고 예정일
	private int order_type;				// 주문부서
	private String transaction_type;	// 거래유형
	private int storage_code;			// 발주처 코드
	private String storage_name;		// 주문창고명
	private String storage_location;	// 주문위치
	private int item_code;				// 주문상태
	private int quantity;				// 주문수량
	private String item_name;			// 품목명
	private String item_standard;		// 규격
	private String client_code;			// 거래처코드
	private String client_name;			// 거래처명

}