package com.spring.erp_ordit.dao.sell;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;

@Mapper
@Repository
public interface SellMapper {	// 판매 입력, 조회, 수정, 삭제
	
	// 판매 조회, 현황 페이지- 전체 리스트
//	public List<SellDTO> sellList();
	
	// 판매 입력 - 등록_주문정보
	public int sell_orderInsert(SellOrderDTO dto);
	
	// 판매 입력 - 등록_물품 정보
	public int sell_itemInsert(SellOrderItemDTO itemDto);
	
	// 판매 - 1건 상세조회
//	public SellRequestClientDTO detailClient(int sc_no);
//	
//	// 판매 - 수정
//	public int updateClient(SellRequestClientDTO dto);
//	
//	// 판매 - 삭제
//	public int deleteClient(int sc_no);
}
