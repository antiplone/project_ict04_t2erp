package com.spring.erp_ordit.dto.warehouse;

import java.sql.Date;

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
public class LogisOrderItemDTO {
	private int order_id;				// 주문번호
	private int order_type;				// 주문부서
	private int quantity;				// 주문수량
	private int price;					// 금액
	private int supply;					// 공급량
	private int vat;					// 부가세
	private int total;					// 총합
	private int item_id;				// 아이템 번호
	private int item_code;				// 아이템 코드
	private String item_name;			// 품목명
	private String item_standard;		// 규격
	private String item_status;			// 품목상태
	private Date item_reg_date;			// 등록 날짜
	private String income_confirm;		// 입고 컨펌
}