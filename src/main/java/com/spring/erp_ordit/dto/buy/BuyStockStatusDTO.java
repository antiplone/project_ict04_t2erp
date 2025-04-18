package com.spring.erp_ordit.dto.buy;

import java.sql.Date;

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
public class BuyStockStatusDTO { // 작성자 - hjy, 입고조회 DTO

	// 주문정보
    private Long order_id ; 			// 주문번호
    private Date order_date;			// 등록일자
	private String start_date;			// 조회시 시작일
	private String end_date;			// 조회시 마지막일
	private int client_code;			// 거래처코드
	private String client_name;			// 거래처명
	private Long item_id;				// 물품고유 번호 FK
	private String item_code; 			// 물품코드 item_id를 찾기 위한 코드
	private String item_name; 			// 물품명
    
    private int storage_code;			// 창고코드
	private String storage_name;		// 창고명
	private int stock_amount;			// 재고
	private int safe_stock;				// 안전재고
	private Date last_date;				// 입고일
}
