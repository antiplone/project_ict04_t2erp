package com.spring.erp_ordit.dao.buy;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyOrderItemMapper {
	
	public List<BuyOrderItemDTO> buyOrderItemList();	// 구매 물품 목록
	
	public int buyOrderItemInsert(BuyOrderItemDTO dto);  // 구매 물품 등록
	
	public int updateOrder(BuyOrderItemDTO dto); 	// 게시글 수정

	public int buyOrderItemDelete(int order_id);	// 구매 물품 삭제
	
	public BuyOrderItemDTO buyOrderItemDetail(int order_id);	// 구매물품 1건 조회
	
}
