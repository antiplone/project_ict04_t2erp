package com.spring.erp_ordit.dao.buy;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderDetailDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyOrderMapper {	// 작성자 - hjy , 구매 조회, 구매현황 조회 Mapper
	
	// 구매 조회 탭 <전체> 목록
	public List<BuyOrderDTO> buyOrderAllList();	
	
	// 구매조회 탭 <결재중> 목록
	public List<BuyOrderDTO> buyOrderPayingList();	
	
	// 구매 조회 탭 <미확인> 목록
	public List<BuyOrderDTO> buyOrderUnchkList();	
	
	// 구매조회 탭 <미확인 "건수"> 조회
	public List<BuyOrderDTO> buyOrderUnchkCount();	
	
	// 구매 조회 탭 <확인> 목록
	public List<BuyOrderDTO> buyOrderCheckList();	
	
	// 구매 내역 <상세> 조회
	public List<BuyOrderDetailDTO> buyOrderDetail(Long order_id);
	
	// 구매 내역 수정
	public void buyUpdateOrder(BuyOrderDTO order);  // 주문정보 수정
	public void buyDeleteOrderItems(int order_id); // 주문 물품정보 삭제
	public void buyInsertOrderItem(BuyOrderItemDTO item);	// 주문 물품정보 입력
	
	//구매입력 - <주문정보 입력> => order.getOrder_id()로 insert 후 ID 자동 세팅
	public int buyOrderInsert(BuyOrderDTO order);  
	
	// 구매 <현황> 조회 
	public List<BuyStatusDTO> buyStatusSearch(
		
		@Param("start_date") String start_date,
		@Param("end_date") String end_date,
        @Param("client_code") String client_code,
        @Param("e_id") String e_id,
        @Param("storage_code") String storage_code,
        @Param("item_code") String item_code,
        @Param("transaction_type") String transaction_type	
	);
	
	// 구매 내역 삭제
	public int buyOrderDelete(int order_id);	
	
//	public int updateOrder(ItemDTO dto); 	// 게시글 수정
	
//	public ItemDTO findByOrderId(int order_id);	// 구매물품 1건 조회
	
}
