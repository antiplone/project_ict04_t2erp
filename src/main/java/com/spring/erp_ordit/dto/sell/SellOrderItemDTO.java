package com.spring.erp_ordit.dto.sell;

import java.math.BigDecimal;

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
public class SellOrderItemDTO {	// 판매입력 _ 아이템 정보 DTO
	
	private int order_id; 				// 고유 주문번호
	private Integer order_item_id; 		// 아이템 테이블의 고유 주문번호 *Integer로 하면 '0'말고도 null값 여부 확인 가능
	private int order_type; 			// 판매팀 구매 입력 1, 구매팀 구매 입력 2
	private String item_standard; 		// 규격
	private int item_code; 				// 물품 코드
	private int quantity; 				// 수량
    private BigDecimal price; 			// 단가
    private BigDecimal supply; 			//공급가액
    private BigDecimal vat; 			// 부가세
    private BigDecimal total;			// 총액
    
}
