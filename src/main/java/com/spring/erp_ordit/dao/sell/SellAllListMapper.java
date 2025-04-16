package com.spring.erp_ordit.dao.sell;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.sell.SellAllListDTO;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;

@Mapper
@Repository
public interface SellAllListMapper {
	
	// 판매 조회, 판매 현황 - 판매 입력한 전체 리스트
	public List<SellAllListDTO> sellAllList();
	
	// 판매 현황 - 검색 후 나오는 전체 리스트
	public List<SellAllListDTO> sellStatusSearchList(SellAllListDTO dto);
	
	// 판매 조회 - 1건 상세 조회
	public List<SellAllListDTO> detailAllList(int order_id);
	
	// 판매 조회 - 수정_주문정보
	public int updateAllList_order(SellOrderDTO dto);
	
	// 판매 조회 - 수정_물품정보
	public int updateAllList_item(SellOrderItemDTO itemDto);
	
	// 판매 조회 - 삭제
	public int deleteAllList(int order_id);
	
}