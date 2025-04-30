package com.spring.erp_ordit.dao.buy;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderDetailDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.dto.buy.BuyStockStatusDTO;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyOrderMapper {	// 작성자 - hjy , 구매 조회, 상세조회, 구매수정, 구매삭제, 구매현황 조회, 입고조회 Mapper
	
	// 구매 조회 탭 <전체> 목록
	public List<BuyOrderDTO> buyOrderAllList();	
	
	// 구매조회 탭 <결재중> 목록
	public List<BuyOrderDTO> buyOrderPayingList();	
	
	// 구매조회 탭 진행상태별 "건수" 조회
	public Map<String, Long> buyOrderStatusCount();	
	
//	// 구매 조회 탭 <미확인> 목록
//	public List<BuyOrderDTO> buyOrderUnchkList();	
//	
//	// 구매조회 탭 <미확인 "건수"> 조회
//	public List<BuyOrderDTO> buyOrderUnchkCount();	
	
	// 구매 조회 탭 <확인> 목록
	public List<BuyOrderDTO> buyOrderCheckList();	
	
	// 구매 내역 <상세> 조회
	public List<BuyOrderDetailDTO> buyOrderDetail(Long order_id);
	
	// 구매 내역 수정
	public void buyUpdateOrder(BuyOrderDTO order);  // 주문정보 수정
	public void buyDeleteOrderItems(int order_id); // 주문 물품정보 삭제
	public void buyInsertOrderItems(List<BuyOrderItemDTO> items);	// 주문 물품정보 입력
	
	//구매입력 - <주문정보 입력> => order.getOrder_id()로 insert 후 ID 자동 세팅
	public int buyOrderInsert(BuyOrderDTO order);  
	
	// 구매 내역 삭제
	public int buyOrderDelete(int order_id);
	
	// 구매 현황 <전체> 조회
	public List<BuyStatusDTO> buyStatusAllList();	
	
	// 구매 현황 <검색> 조회
	public List<BuyStatusDTO> buyStatusSearch(
		
		@Param("start_date") String start_date,
		@Param("end_date") String end_date,
        @Param("client_code") String client_code,
        @Param("e_id") String e_id,
        @Param("storage_code") String storage_code,
        @Param("item_code") String item_code,
        @Param("transaction_type") String transaction_type	
	);
	
	// 입고 현황 <전체> 조회
	public List<BuyStockStatusDTO> getBuyStockStatusAllList();
	
	// 입고현황 조회
	public List<BuyStockStatusDTO> buyStockStatusSearch(
			
		@Param("start_date") String start_date,
		@Param("end_date") String end_date,
		@Param("order_id") String order_id,
        @Param("client_code") String client_code,
        @Param("item_code") String item_code,
        @Param("storage_code") String storage_code,
        @Param("stock_amount") String stock_amount,
        @Param("safe_stock") String safe_stock,
        @Param("last_date") String last_date
	);
	
}
