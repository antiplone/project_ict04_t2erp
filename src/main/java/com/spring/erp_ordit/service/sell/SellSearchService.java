package com.spring.erp_ordit.service.sell;

import java.util.List;

import com.spring.erp_ordit.dto.sell.SellSearchClientDTO;
import com.spring.erp_ordit.dto.sell.SellSearchDTO;
import com.spring.erp_ordit.dto.sell.SellSearchEmployeeDTO;
import com.spring.erp_ordit.dto.sell.SellSearchStorageDTO;

public interface SellSearchService {
	
	// 판매 물품 검색 - 물품 전체 리스트
	public List<SellSearchDTO> sellSearchList();
	
	// 판매 - 품목명 리스트 모달
	public List<SellSearchDTO> sellItemList();
	
	// 판매 - 거래처 검색 모달
	public List<SellSearchClientDTO> sellClientList();
		
	// 판매 - 담당자 검색 모달
	public List<SellSearchEmployeeDTO> sellEmployeeList();
		
	// 판매 - 창고 검색 모달
	public List<SellSearchStorageDTO> sellWarehouseList();
	
}
