package com.spring.erp_ordit.dto.warehouse;

import java.sql.Date;	// 주의

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
public class LogisSalesDTO {
	private int order_id;				// 품목번호
	private Date order_date;			// 수주일
	private Date shipment_order_date;	// 츨고예정일
	private int order_type;				// 부서구분
	private String transaction_type;	// 결제 구분
	private int storage_code;			// 창고코드
	private String storage_name;		// 창고명
	private String storage_location;	// 창고위치
	private int item_code;				// 품명코드
	private int quantity;				// 출고량
	private String item_name;			// 품목명
	private String item_standard;		// 규격
	private int client_code;			// 고객코드
	private String client_name;			// 거래처명
	private String income_confirm;		// 출고 컨펌
}