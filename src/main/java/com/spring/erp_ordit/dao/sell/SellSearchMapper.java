package com.spring.erp_ordit.dao.sell;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.sell.SellSearchClientDTO;
import com.spring.erp_ordit.dto.sell.SellSearchDTO;
import com.spring.erp_ordit.dto.sell.SellSearchEmployeeDTO;
import com.spring.erp_ordit.dto.sell.SellSearchStorageDTO;

@Mapper
@Repository
public interface SellSearchMapper {
	
	// 판매 물품 검색 - 등록 물품 리스트
	public List<SellSearchDTO> sellSearchList();
	
	// 판매 물품 검색 - 키워드로 검색하는 물품 리스트 모달
	public List<SellSearchDTO> sellSearchResultList(SellSearchDTO dto);
	
	// 판매 - 품목명 리스트 모달(키워드로 검색)
	public List<SellSearchDTO> sellSearchItemDetailList(String keyword);
	
	// 판매 - 물품 리스트 모달
	public List<SellSearchDTO> sellItemList();
	
	// 판매 - 거래처 검색 모달(키워드로 검색)
	public List<SellSearchClientDTO> sellSearchClientDetailList(String keyword);
		
	// 판매 - 거래처 검색 모달
	public List<SellSearchClientDTO> sellClientList();

	// 판매 - 담당자 검색 모달(키워드로 검색)
	public List<SellSearchEmployeeDTO> sellSearchEmployeeDetailList(String keyword);
	
	// 판매 - 담당자 검색 모달
	public List<SellSearchEmployeeDTO> sellEmployeeList();
	
	// 판매 - 창고 검색 모달(키워드로 검색)
	public List<SellSearchStorageDTO> sellSearchWarehouseDetailList(String keyword);
	
	// 판매 - 창고 검색 모달
	public List<SellSearchStorageDTO> sellWarehouseList();
}