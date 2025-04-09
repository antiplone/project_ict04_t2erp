package com.spring.erp_ordit.service.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyOrderMapper;
import com.spring.erp_ordit.dto.buy.BuyOrderDTO;

@Service
@Transactional  // 트랜잭션 적용
public class BuyOrderServiceImpl {
	
	@Autowired
	private BuyOrderMapper BuyOrderMapper;
	
	// 구매 조회 탭 전체 목록
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderDTO> buyOrderAllList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderAllList >>>");
		
		return BuyOrderMapper.buyOrderAllList();
	}
	
	// 구매 조회 탭 미확인 목록
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderDTO> buyOrderYetList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderYetList >>>");
		
		return BuyOrderMapper.buyOrderYetList();
	}
	
	// 구매조회 탭 미확인 "건수" 조회
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderDTO> buyOrderUncheckedList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderUncheckedList >>>");
		
		return BuyOrderMapper.buyOrderUncheckedList();
	}
	
	// 구매 입력
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public int buyOrderInsert(BuyOrderDTO dto) {
		return BuyOrderMapper.buyOrderInsert(dto);	// mybatis에서는 I,U,D 리턴타입이 int(1:성공, 0:실패)
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
