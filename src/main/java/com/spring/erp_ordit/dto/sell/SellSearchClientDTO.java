package com.spring.erp_ordit.dto.sell;

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
public class SellSearchClientDTO {	// 판매_거래처 찾기 모달
	
	private String client_code; // 거래처명
	private String client_name; // 거래처명

}
