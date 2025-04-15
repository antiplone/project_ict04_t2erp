package com.spring.erp_ordit.service.sell;

import java.util.List;

import com.spring.erp_ordit.dto.sell.SellAllListDTO;

public interface SellAllListService {
	
	// 판매 조회 - 판매 입력한 전체 리스트
	public List<SellAllListDTO> sellAllList();
	
	
}
