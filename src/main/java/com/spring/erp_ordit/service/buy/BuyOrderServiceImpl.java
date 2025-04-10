package com.spring.erp_ordit.service.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyItemMapper;
import com.spring.erp_ordit.dao.buy.BuyOrderItemMapper;
import com.spring.erp_ordit.dao.buy.BuyOrderMapper;
import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;

@Service
@Transactional  // 트랜잭션 적용
public class BuyOrderServiceImpl {
	
	@Autowired
	private BuyOrderMapper buyOrderMapper;
	
	@Autowired
	private BuyOrderItemMapper buyOrderItemMapper;
	
	@Autowired
	private BuyItemMapper buyItemMapper;
	
	// 구매 조회 탭 전체 목록
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderDTO> getBuyOrderAllList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderAllList >>>");
		
		return buyOrderMapper.buyOrderAllList();
	}
	
	// 구매 조회 탭 미확인 목록
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderDTO> getBuyOrderUnchkList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderUnchkList >>>");
		
		return buyOrderMapper.buyOrderUnchkList();
	}
	
	// 구매조회 탭 미확인 "건수" 조회
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderDTO> getBuyOrderUnchkCount() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderUnchkCount >>>");
		
		return buyOrderMapper.buyOrderUnchkCount();
	}
	
	// 구매 조회 탭 확인 목록
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderDTO> getBuyOrderCheckList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderCheckList >>>");
		
		return buyOrderMapper.buyOrderCheckList();
	}
	
	// 구매입력 - 주문정보와 물품정보 
	@Transactional
	public void setBuyInsertAll(BuyOrderDTO order, List<BuyOrderItemDTO> items) {
		buyOrderMapper.buyOrderInsert(order);	// 구매주문 입력 - order_id가 자동주입 
		Long order_id = order.getOrder_id();
		
		for (BuyOrderItemDTO item : items) {
			item.setOrder_id(order_id);
			
			// item_code로 item_id 조회하여 자동 설정
			if (item.getItem_id() == null && item.getItem_code() != null) {
				Long item_id = buyItemMapper.findItemIdByCode(item.getItem_code());
				if (item_id == null) {
					throw new RuntimeException("해당 item_code의 item_id를 찾을 수 없습니다: " + item.getItem_code());
				}
				item.setItem_id(item_id);
			}
			
			buyOrderItemMapper.buyOrderItemInsert(item); // 구매주문에 해당하는 물품정보 입력
		}
	}
	
	// 구매 현황 조회 
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyStatusDTO> getBuyStatusSearch(String order_date, String client_code, String e_id,
            								 String storage_code, String item_code, String transaction_type) {
		System.out.println("<<< BuyOrderServiceImpl - buyStatusSearch >>>");
		
		 return buyOrderMapper.buyStatusSearch(order_date, client_code, e_id, storage_code, item_code, transaction_type);
	}
	
//	// 전표 등록
//	@Transactional
//    public int saveBuyOrder(OrderDTO dto) {
//        // 1. order_tbl에 저장
//		buyOrderMapper.saveBuyOrder(dto);
//
//        // 2. 방금 생성된 order_id 가져오기
//        int order_id = buyOrderMapper.getLastInsertedOrderId();
//
//        // 3. 각 품목 저장
//        for (OrderItemDTO item : dto.getItems()) {
//        	buyOrderMapper.saveOrderItem(order_id, item);
//        }
//        return buyOrderMapper.saveBuyOrder(dto);
//    }
	
//	// 게시글 상세
//	@Transactional(readOnly=true)
//	public ItemDTO findByOrderId(int order_id) {
//		return ItemMapper.findByOrderId(order_id);
//				//.orElseThrow(() -> new IllegalArgumentException("게시글 번호를 확인해주세요.!!")); // ->는 람다식
//	}
//	
//	// 구매 물품 등록
//	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
//	public int saveItem(ItemDTO dto) {
//		return ItemMapper.insertItem(dto);	// mybatis에서는 I,U,D 리턴타입이 int(1:성공, 0:실패)
//	}
//	
//	// 게시글 삭제
//	@Transactional
//	public String deleteOrder(int order_id) {	
//		ItemMapper.deleteOrder(order_id);
//		return "ok";
//	}
//	
//	// 게시글 수정
//	@Transactional
//	public int updateOrder(int order_id, ItemDTO dto) {	
//	
//		return ItemMapper.updateOrder(dto);
//	}
}
