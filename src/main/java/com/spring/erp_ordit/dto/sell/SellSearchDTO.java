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
public class SellSearchDTO {
	
	private int order_id;			// 주문번호
	private int item_code;			// 물품코드
	private String item_name;		// 물품명
	private String item_standard;	// 규격
	private String storage_name;	// 창고명
	private int stock_amount;		// 수량
	private int price;				// 단가
	private String client_name;		// 거래처명
	private Date item_reg_date;		//  등록일
	
}
