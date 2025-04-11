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
public class SellAllListDTO {	// 판매 입력건 조회
	
	private int order_id;  	  			// 주문번호
	private int item_code;  	  		// 물품코드
	private String item_name; 	  		// 물품명
	private String item_standard; 		// 규격
	private int storage_code;		  	// 창고코드
	private String storage_name;		// 창고명
	private int client_code;			// 거래처코드
	private String client_name;	  		// 거래처명
	private int price;			 		// 단가
	private int supply;			 		// 공급가
	private int total;			  		// 합계
	private String transaction_type;	// 거래유형
	private Date order_date;		 	// 등록일
	private Date shipment_order_date;	// 출하지시일
	
}
