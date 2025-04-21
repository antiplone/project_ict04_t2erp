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
		
		return SearchMapper.sellSearchResultList(dto);
	}
	
	// 판매 입력 - 품목명 리스트 모달(키워드로 검색)
	@Override
	public List<SellSearchDTO> sellSearchItemDetailList(String keyword) {
		System.out.println("서비스 - sellSearchResultList");
		
		return SearchMapper.sellSearchItemDetailList(keyword);
	}

	// 판매 - 품목명 리스트 모달
	@Override
	public List<SellSearchDTO> sellItemList() {
		System.out.println("서비스 - sellItemList");
		
		return SearchMapper.sellItemList();
	}
	
	// 판매 - 거래처 검색 모달(키워드로 검색)
	@Override
	public List<SellSearchClientDTO> sellSearchClientDetailList(String keyword) {
		System.out.println("서비스 - sellSearchClientDetailList");

		return SearchMapper.sellSearchClientDetailList(keyword);
	}
	
	// 판매 - 거래처 검색 모달
	@Override
	public List<SellSearchClientDTO> sellClientList() {
		System.out.println("서비스 - sellClientList");
		
		return SearchMapper.sellClientList();
	}
	
	// 판매 - 담당자 검색 모달(키워드로 검색)
	@Override
	public List<SellSearchEmployeeDTO> sellSearchEmployeeDetailList(String keyword) {
		System.out.println("서비스 - sellSearchEmployeeDetailList");
		
		return SearchMapper.sellSearchEmployeeDetailList(keyword);
	}
	
	// 판매 - 담당자 검색 모달
	@Override
	public List<SellSearchEmployeeDTO> sellEmployeeList() {
		System.out.println("서비스 - sellEmployeeList");
		
		return SearchMapper.sellEmployeeList();
	}
	
	// 판매 - 창고 검색 모달(키워드로 검색)
	@Override
	public List<SellSearchStorageDTO> sellWarehouseDetailList(String keyword) {
		System.out.println("서비스 - sellWarehouseDetailList");
		
		return SearchMapper.sellSearchWarehouseDetailList(keyword);
	}
	
	// 판매 - 창고 검색 모달
	@Override
	public List<SellSearchStorageDTO> sellWarehouseList() {
		System.out.println("서비스 - sellWarehouseList");
		
		return SearchMapper.sellWarehouseList();
	}
}
