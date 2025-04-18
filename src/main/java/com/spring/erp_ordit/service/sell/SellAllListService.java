package com.spring.erp_ordit.service.sell;

import java.util.List;

import com.spring.erp_ordit.dto.sell.SellAllListDTO;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;

public interface SellAllListService {
	
	// 판매 입력 - 등록
	public int sellInsert(SellOrderDTO dto);
	
	// 판매 조회, 판매 현황 - 판매 입력한 전체 리스트
	public List<SellAllListDTO> sellAllList();
	
	// 판매 현황 - 검색 후 나오는 전체 리스트
	public List<SellAllListDTO> sellStatusSearchList(SellAllListDTO dto);
	
	// 판매 조회 - 1건 상세 조회
	public List<SellAllListDTO> detailAllList(int order_id);
	
	// 판매 조회 - 수정
	public int updateAllList(int order_id, SellOrderDTO dto);
	
	// 판매 조회 - 삭제
	public String deleteAllList(int order_id);
	
}
