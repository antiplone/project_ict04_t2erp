package com.spring.erp_ordit.service.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyItemMapper;
import com.spring.erp_ordit.dao.buy.BuyOrderItemMapper;
import com.spring.erp_ordit.dao.buy.BuyOrderMapper;
import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderDetailDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;

@Service
@Transactional  // 트랜잭션 적용
public class BuyOrderServiceImpl {	// 작성자 - hjy, 구매조회(전체,결재중,미확인,확인), 구매 입력, 구매현황 조회 service
	
	@Autowired
	private BuyOrderMapper buyOrderMapper;
	
	@Autowired
	private BuyOrderItemMapper buyOrderItemMapper;
	
	@Autowired
	private BuyItemMapper buyItemMapper;
	
	// 구매조회 탭 <전체> 목록
	public List<BuyOrderDTO> getBuyOrderAllList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderAllList >>>");
		
		return buyOrderMapper.buyOrderAllList();
	}
	
	// 구매조회 탭 <결재중> 목록
	public List<BuyOrderDTO> getBuyOrderPayingList() {
		
		System.out.println("<<< BuyOrderServiceImpl - getBuyOrderPayingList >>>");
		
		return buyOrderMapper.buyOrderPayingList();
	}
	
	// 구매조회 탭 <미확인> 목록
	public List<BuyOrderDTO> getBuyOrderUnchkList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderUnchkList >>>");
		
		return buyOrderMapper.buyOrderUnchkList();
	}
	
	// 구매조회 탭 <미확인> "건수" 조회
	public List<BuyOrderDTO> getBuyOrderUnchkCount() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderUnchkCount >>>");
		
		return buyOrderMapper.buyOrderUnchkCount();
	}
	
	// 구매조회 탭 <확인> 목록
	public List<BuyOrderDTO> getBuyOrderCheckList() {
		
		System.out.println("<<< BuyOrderServiceImpl - buyOrderCheckList >>>");
		
		return buyOrderMapper.buyOrderCheckList();
	}
	
	// 구매 내역 <상세> 조회
	public List<BuyOrderDetailDTO> getBuyOrderDetail(Long order_id) {
			
		System.out.println("<<< BuyOrderServiceImpl - getBuyOrderDetail >>>");
		
		return buyOrderMapper.buyOrderDetail(order_id);
	}
	
	// 구매 입력 <한건의 주문정보 + 다건의 물품정보>
	@Transactional
	public void setBuyInsertAll(BuyOrderDTO order, List<BuyOrderItemDTO> items) {
		
		buyOrderMapper.buyOrderInsert(order);	// 구매주문 입력 - order_id가 자동주입 => MyBatis에서 useGeneratedKeys="true" 설정해서 자동 주입됨.
		Long order_id = order.getOrder_id();	// insert 후 자동 생성된 order_id 가져옴
		
		// 각 품목 객체에 order_id를 세팅
		for (BuyOrderItemDTO item : items) {
			item.setOrder_id(order_id); // → order_item_tbl에 insert할 때 FK로 사용
			
			// item_code로 item_id 조회하여 자동 설정 => 못찾으면 예외 발생하고 @Transactional에 의해 롤백됨. => @Transactional으로 롤백 안하면 데이터가 부분만 저장되는 비정상 상태가 됨.
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
	
	// 구매내역 삭제
	public String buyOrderDelete(int order_id) {	
		buyOrderMapper.buyOrderDelete(order_id);
		return "ok";
	}

	// 구매 현황 조회 
	public List<BuyStatusDTO> getBuyStatusSearch(String start_date, String end_date, String client_code, String e_id,
            								 String storage_code, String item_code, String transaction_type) {
		System.out.println("<<< BuyOrderServiceImpl - buyStatusSearch >>>");
		
		 return buyOrderMapper.buyStatusSearch(start_date, end_date, client_code, e_id, storage_code, item_code, transaction_type);
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
	
}
