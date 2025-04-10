package com.spring.erp_ordit.dto.buy;

import java.sql.Date;	// 주의

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
public class BuyStatusDTO {

	// 주문정보
	private int order_id ; 				// 주문번호
	private int order_type;				// 주문타입 type 1 판매팀, type 2 구매팀
	private int	order_code;				// 구매팀 발주번호
	private Date order_date;			// 등록일자
	private int e_id;					// 사원코드
	private String e_name;				// 사원명
	private int client_code;			// 거래처코드
	private String client_name;			// 거래처명
	private Date delivery_date;			// 납기일자
	private Long item_id;				// 물품고유 번호 FK
	private String item_code; 			// 물품코드 item_id를 찾기 위한 코드
	private String item_name; 			// 물품명
	private int quantity; 				// 수량
    private int price;					// 단가
    private int total;					// 총액
    
    // 주문상태
    private String transaction_type;	// 거래유형
    private int storage_code;			// 창고코드
	private String storage_name;		// 창고명
	private String closing_status ; 	// 종결여부
	private String chit_id;				// 전표번호
	
}
