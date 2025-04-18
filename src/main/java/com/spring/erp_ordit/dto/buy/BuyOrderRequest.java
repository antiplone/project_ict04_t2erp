package com.spring.erp_ordit.dto.buy;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

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
public class BuyOrderRequest {	// 작성자 - hjy , 구매팀 주문요청 @RequestBody BuyOrderRequest request 부분
	
	// 주문정보 + 품목 리스트
	@JsonProperty("order")
	private BuyOrderDTO order; // 주문정보
	
	@JsonProperty("items")
    private List<BuyOrderItemDTO> items; // 주문에 해당하는 물품정보
	
	@JsonProperty("status")
	private BuyStatusDTO status;		 // 진행상태
}
