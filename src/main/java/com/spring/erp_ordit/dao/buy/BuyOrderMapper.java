package com.spring.erp_ordit.dao.buy;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyOrderDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyOrderMapper {
	
	public List<BuyOrderDTO> buyOrderAllList();	// 구매 조회 탭 전체 목록

	public List<BuyOrderDTO> buyOrderYetList();	// 구매 조회 탭 미확인 목록
	
	public List<BuyOrderDTO> buyOrderUncheckedList();	// 구매조회 탭 미확인 "건수" 조회
	
	public int buyOrderInsert(BuyOrderDTO dto);	// 구매 입력
	
//	// 구매 주문 등록
//	public int saveBuyOrder(OrderDTO dto);
//
//	public int getLastInsertedOrderId();
//
//	public int saveOrderItem(@Param("order_id") int order_id, @Param("item") OrderItemDTO item);
	
//	public int insertItem(ItemDTO dto);  // 구매 물품 등록
//	
//	public int updateOrder(ItemDTO dto); 	// 게시글 수정
//
//	public int deleteOrder(int order_id);	// 구매 물품 삭제
//	
//	public ItemDTO findByOrderId(int order_id);	// 구매물품 1건 조회
	
}
