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
	private SellSearchMapper mapper;
	
	// 판매 물품 검색 - 물품 리스트
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchDTO> sellSearchList() {
		System.out.println("서비스 - sellSearchList");
		
		return mapper.sellSearchList();
	}
	
	// 판매 물품 검색 - 원하는 품목 선택 검색한 물품 리스트
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchDTO> sellSearchResultList(SellSearchDTO dto) {
		System.out.println("서비스 - sellSearchResultList");
		
		return mapper.sellSearchResultList(dto);
	}
	
	// 판매 입력 - 품목명 리스트 모달(키워드로 검색)
	@Override
	@Transactional
	public List<SellSearchDTO> sellSearchItemDetailList(String keyword) {
		System.out.println("서비스 - sellSearchResultList");
		
		return mapper.sellSearchItemDetailList(keyword);
	}

	// 판매 - 품목명 리스트 모달
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchDTO> sellItemList() {
		System.out.println("서비스 - sellItemList");
		
		return mapper.sellItemList();
	}
	
	// 판매 입력 - 창고 선택 시 조회되는 품목 리스트 모달(키워드로 검색)
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchDTO> storage_itemListKey(int storage_code, String keyword) {
		System.out.println("서비스 - storage_itemList");

		return mapper.storage_itemListKey(storage_code, keyword);
	}
	
	// 판매 입력 - 창고 선택 시 조회되는 품목 리스트 모달
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchDTO> storage_itemList(int storage_code) {
		System.out.println("서비스 - storage_itemList");
		
		return mapper.storage_itemList(storage_code);
	}
	
	// 판매 - 거래처 검색 모달(키워드로 검색)
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchClientDTO> sellSearchClientDetailList(String keyword) {
		System.out.println("서비스 - sellSearchClientDetailList");

		return mapper.sellSearchClientDetailList(keyword);
	}
	
	// 판매 - 거래처 검색 모달
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchClientDTO> sellClientList() {
		System.out.println("서비스 - sellClientList");
		
		return mapper.sellClientList();
	}
	
	// 판매 - 담당자 검색 모달(키워드로 검색)
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchEmployeeDTO> sellSearchEmployeeDetailList(String keyword) {
		System.out.println("서비스 - sellSearchEmployeeDetailList");
		
		return mapper.sellSearchEmployeeDetailList(keyword);
	}
	
	// 판매 - 담당자 검색 모달
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchEmployeeDTO> sellEmployeeList() {
		System.out.println("서비스 - sellEmployeeList");
		
		return mapper.sellEmployeeList();
	}
	
	// 판매 - 창고 검색 모달(키워드로 검색)
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchStorageDTO> sellWarehouseDetailList(String keyword) {
		System.out.println("서비스 - sellWarehouseDetailList");
		
		return mapper.sellSearchWarehouseDetailList(keyword);
	}
	
	// 판매 - 창고 검색 모달
	@Override
	@Transactional(readOnly=true)
	public List<SellSearchStorageDTO> sellWarehouseList() {
		System.out.println("서비스 - sellWarehouseList");
		
		return mapper.sellWarehouseList();
	}

}
