package com.spring.erp_ordit.dto.buy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data					// @Getter + @Setter 
@AllArgsConstructor		// 매개변수 생성자 
@NoArgsConstructor		// 디폴트 생성자
@ToString				// toString
@Builder				// 매개변수 생성자에 순서없이 값을 입력해서 세팅해도 마지막에 build()를 통해 빌더를 작동, 같은 타입의 다른변수의 값을 서로 바꿔 넣는 것을 방지한다.
public class BuyOrderItemDTO {
	
	// 물품정보
	private Long order_id ; 			// 주문번호
	private int order_type ; 			// 주문타입 판매 1, 구매 2
	private int order_code;				// 구매팀 발주번호
	
	private Long item_id;				// 물품고유 번호 FK
	private String item_code; 				// 물품코드 item_id를 찾기 위한 코드
	private String item_name; 			// 물품명
	
	private int quantity; 				// 수량
    private int price;					// 단가	
    private int supply;					// 공급가
    private int vat;					// 부가세
    private int total;					// 총액
	
}
