package com.spring.erp_ordit.service.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyOrderItemMapper;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;

@Service
@Transactional  // 트랜잭션 적용
public class BuyOrderItemServiceImpl {
	
	@Autowired
	private BuyOrderItemMapper BuyOrderItemMapper;
	
	// 구매 물품 목록
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public List<BuyOrderItemDTO> buyOrderItemList() {
		
		return BuyOrderItemMapper.buyOrderItemList();
	}
	
//	// 게시글 상세
//	@Transactional(readOnly=true)
//	public BuyOrderItemDTO buyOrderItemDetail(int order_id) {
//		return BuyOrderItemMapper.buyOrderItemDetail(order_id);
//				//.orElseThrow(() -> new IllegalArgumentException("게시글 번호를 확인해주세요.!!")); // ->는 람다식
//	}
	
	// 구매 물품 등록
	@Transactional // 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리하겠다.
	public int buyOrderItemInsert(BuyOrderItemDTO dto) {
		return BuyOrderItemMapper.buyOrderItemInsert(dto);	// mybatis에서는 I,U,D 리턴타입이 int(1:성공, 0:실패)
	}
	
	// 게시글 삭제
	@Transactional
	public String buyOrderItemDelete(int order_id) {	
		BuyOrderItemMapper.buyOrderItemDelete(order_id);
		return "ok";
	}
	
//	// 게시글 수정
//	@Transactional
//	public int updateOrder(int order_id, BuyOrderItemDTO dto) {	
//	
//		return BuyOrderItemMapper.updateOrder(dto);
//	}
}
