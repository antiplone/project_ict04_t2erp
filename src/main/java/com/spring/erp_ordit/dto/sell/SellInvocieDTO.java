package com.spring.erp_ordit.dto.sell;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

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
public class SellInvocieDTO {	// 판매조회 _ 거래명세서 DTO
	
	private int order_id; 				// 고유 주문번호
	private int order_type; 			// 판매팀 구매 입력 1, 구매팀 구매 입력 2
	private String order_date; 			// 입력일자
	private int e_id; 					// 사원코드 
	private String e_name; 				// 담당자명 
	private int client_code; 			// 거래처코드  				   	 
	private String client_name; 		// 거래처명 				   	 
	private String c_ceo; 				// 거래처명 				   	 
	private String c_base_address; 		// 거래처주소 (도로명)			   	 
	private String c_detail_address; 	// 거래처주소 (상세주소)			   	 
	private String sc_biz_num; 			// 사업자등록번호				   	 
	private String c_tel; 				// 연락처				   	 
	private int storage_code;	 		// 창고코드
	private String transaction_type; 	// 거래유형(부가세 적용, 미적용)   	 
	private Date shipment_order_date;	// 출하지시일
	private int item_code; 				// 물품 코드
	private String item_name; 			// 물품명
	private String item_standard; 		// 규격
	private int quantity; 				// 수량
    private BigDecimal price; 			// 단가
    private BigDecimal supply; 			// 공급가액
    private BigDecimal vat; 			// 부가세
    private BigDecimal total;			// 총액
	
}
