package com.spring.erp_ordit.service.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyItemMapper;
import com.spring.erp_ordit.dao.buy.BuyOrderItemMapper;
import com.spring.erp_ordit.dao.buy.BuyOrderMapper;
import com.spring.erp_ordit.dao.buy.BuyStatusMapper;
import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderDetailDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderRequest;
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
	
	@Autowired
	private BuyStatusMapper buyStatusMapper;
	
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
	
	// 구매 내역 수정
	@Transactional
	public int buyOrderUpdate(int order_id, BuyOrderRequest request) {
	    // 1. 주문 정보 수정
	    BuyOrderDTO order = request.getOrder();
	    order.setOrder_id((long) order_id); // int → Long으로 변환

	    buyOrderMapper.buyUpdateOrder(order); // 주문 정보 수정

	    // 2. 기존 물품 정보 삭제
	    buyOrderMapper.buyDeleteOrderItems(order_id);

	    // 3. 물품 정보 재등록
	    List<BuyOrderItemDTO> items = request.getItems();
	    
	    for (BuyOrderItemDTO item : items) {
	        item.setOrder_id((long) order_id); // 각 항목에 order_id 넣기
	        item.setOrder_type(order.getOrder_type()); 	// 주문정보에서 order_type 받아오기
	    
		    // item_code로 item_id 조회하여 자동 설정 => 못찾으면 예외 발생하고 @Transactional에 의해 롤백됨. => @Transactional으로 롤백 안하면 데이터가 부분만 저장되는 비정상 상태가 됨.
	        if (item.getItem_id() == null && item.getItem_code() != null) {
				Long item_id = buyItemMapper.findItemIdByCode(item.getItem_code());
				if (item_id == null) {
					throw new RuntimeException("해당 item_code의 item_id를 찾을 수 없습니다: " + item.getItem_code());
				}
				item.setItem_id(item_id);
			}
	    }
	    // 전체 리스트 insert
	    buyOrderMapper.buyInsertOrderItems(items);
	    
	    // 4. 상태 정보 업데이트 (order_status_tbl)
	    BuyStatusDTO updateStatus = request.getStatus(); // 프론트에서 넘긴 status
	    if (updateStatus == null) {
	        updateStatus = new BuyStatusDTO();
	    }
	    updateStatus.setOrder_id((long) order_id);
	    
	    // order_status 기본값 보완
	    if (updateStatus.getOrder_status() == null || updateStatus.getOrder_status().trim().isEmpty()) {
	        updateStatus.setOrder_status("미확인");
	    }
	        // 기존 상태가 있으면 UPDATE, 없으면 INSERT
	        if (buyStatusMapper.existsStatus((long)order_id) > 0) {
	            buyStatusMapper.updateOrderStatus(updateStatus);
	        } else {
	            buyStatusMapper.insertOrderStatus2(updateStatus);
	        }

	    return 1; // 성공 반환 (또는 처리된 row 수 반환 가능)
	}
	
	// 구매 입력 <한건의 주문정보 + 다건의 물품정보>
	@Transactional
	public void setBuyInsertAll(BuyOrderRequest request) {
		
		BuyOrderDTO order = request.getOrder();
		List<BuyOrderItemDTO> items = request.getItems();
		
		// 구매팀은 주무입력시 자동으로 '진행중' 상태로 지정
		order.setOrder_status("진행중");
		
		buyOrderMapper.buyOrderInsert(order);	// 구매주문 입력 - order_id가 자동주입 => MyBatis에서 useGeneratedKeys="true" 설정해서 자동 주입됨.
		Long order_id = order.getOrder_id();	// insert 후 자동 생성된 order_id 가져옴
		
		// 주문 상태값 저장 (order_status_tbl)
	    BuyStatusDTO status = new BuyStatusDTO();
	    status.setOrder_id((long)order_id);
	    status.setOrder_status(order.getOrder_status()); // "진행중"
	    buyStatusMapper.insertOrderStatus(status);
		
	    // 각 품목에 order_id와 item_id 설정 후 DB에 insert
		for (BuyOrderItemDTO item : items) {
			item.setOrder_id(order_id); // → order_item_tbl에 insert할 때 FK로 사용
			
			// item_code로 item_id 조회하여 자동 설정 => 못찾으면 예외 발생하고 @Transactional에 의해 롤백됨. => @Transactional으로 롤백 안하면 데이터가 부분만 저장되는 비정상 상태가 됨.
			if (item.getItem_id() == null && 
				item.getItem_code() != null && 
				!item.getItem_code().toString().trim().isEmpty()) {
				
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
