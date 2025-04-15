package com.spring.erp_ordit.dao.sell;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;

@Mapper
@Repository
public interface SellMapper {	// 판매 입력
	
	// 판매 입력 - 등록_주문정보
	public int sell_orderInsert(SellOrderDTO dto);
	
	// 판매 입력 - 등록_물품 정보
	public int sell_itemInsert(SellOrderItemDTO itemDto);
	
	// 판매 입력 - 등록_결재 테이블
	public int sell_approvalInsert(int order_id);
	
}
