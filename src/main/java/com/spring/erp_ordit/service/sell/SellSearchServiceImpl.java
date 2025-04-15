package com.spring.erp_ordit.service.sell;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.sell.SellSearchMapper;
import com.spring.erp_ordit.dto.sell.SellSearchClientDTO;
import com.spring.erp_ordit.dto.sell.SellSearchDTO;
import com.spring.erp_ordit.dto.sell.SellSearchEmployeeDTO;
import com.spring.erp_ordit.dto.sell.SellSearchStorageDTO;

@Service
public class SellSearchServiceImpl implements SellSearchService {
	
	@Autowired
	private SellSearchMapper SearchMapper;
	
	// 판매 물품 검색 - 물품 리스트
	@Override
	public List<SellSearchDTO> sellSearchList() {
		System.out.println("서비스 - sellSearchList");
		
		return SearchMapper.sellSearchList();
	}
	
	// 판매 물품 검색 - 원하는 품목 선택 검색한 물품 리스트
	@Override
	public List<SellSearchDTO> sellSearchResultList(SellSearchDTO dto) {
		System.out.println("서비스 - sellSearchResultList");
		System.out.println("서비스 - dto: " + dto);
		
		return SearchMapper.sellSearchResultList(dto);
	}
	
	// 판매 - 품목명 리스트 모달
	@Override
	public List<SellSearchDTO> sellItemList() {
		System.out.println("서비스 - sellItemList");
		
		return SearchMapper.sellItemList();
	}
	
	// 판매 - 거래처 검색 모달
	@Override
	public List<SellSearchClientDTO> sellClientList() {
		System.out.println("서비스 - sellClientList");
		
		return SearchMapper.sellClientList();
	}
	
	// 판매 - 담당자 검색 모달
	@Override
	public List<SellSearchEmployeeDTO> sellEmployeeList() {
		System.out.println("서비스 - sellClientList");
		
		return SearchMapper.sellEmployeeList();
	}
	
	// 판매 - 창고 검색 모달
	@Override
	public List<SellSearchStorageDTO> sellWarehouseList() {
		System.out.println("서비스 - sellWarehouseList");
		
		return SearchMapper.sellWarehouseList();
	}

}
