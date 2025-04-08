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
public class BuySearchDTO {
	
	// 거래처 검색
	private int client_code;			// 거래처번호
	private String client_name;			// 거래처명
	
	// 담당자 검색
	private String e_id;				// 사원번호
	private String e_name;				// 담당자
	private String d_name;				// 부서명
	
	// 입고창고 검색
	private int storage_code; 			// 창고 코드
	private String storage_name; 		// 창고명
	
	// 물품코드 검색
	private int item_code;   			// 물품코드
    private String item_name;			// 물품명
	
}
