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
	
	private int item_code;  	  // 물품코드
	private String item_name; 	  // 물품명
	private String item_standard; // 규격
	private String storage;		  // 창고명
	private int quantity;		  // 수량
	private int price;			  // 단가
	private String client_name;	  // 거래처명
	//private int supply;			  // 공급가
	//private int total;			  // 합계
	private Date date;			 //  등록일
	
}
