package com.spring.erp_ordit.service.buy;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import com.spring.erp_ordit.dto.buy.BuyStockStatusDTO;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;

@Service
@Transactional  // 트랜잭션 적용
public class BuyOrderServiceImpl {	// 작성자 - hjy, 구매조회(전체,결재중,미확인,확인), 상세조회, 구매수정, 구매 입력, 구매삭제, 구매현황 조회, 입고현황 service
	
	@Autowired
	private BuyOrderMapper buyOrderMapper;
	
	@Autowired
	private BuyOrderItemMapper buyOrderItemMapper;
	
	@Autowired
	private BuyItemMapper buyItemMapper;
	
	@Autowired
	private BuyStatusMapper buyStatusMapper;
	
	// -------------  구매조회 페이지 --------------------------------------------------------------------------------------
	// 구매조회 탭 <전체> 목록
	public List<BuyOrderDTO> getBuyOrderAllList() {
		
		return buyOrderMapper.buyOrderAllList();
	}
	
	// 구매조회 탭 <결재중> 목록
	public List<BuyOrderDTO> getBuyOrderPayingList() {
		
		return buyOrderMapper.buyOrderPayingList();
	}
	
	// 구매조회 탭 진행상태별 "건수" 조회
	public Map<String, Long> getBuyOrderStatusCount() {
		
		return buyOrderMapper.buyOrderStatusCount();
	}
	
//	// 구매조회 탭 <미확인> 목록
//	public List<BuyOrderDTO> getBuyOrderUnchkList() {
//		
//		return buyOrderMapper.buyOrderUnchkList();
//	}
//	
//	// 구매조회 탭 <미확인> "건수" 조회
//	public List<BuyOrderDTO> getBuyOrderUnchkCount() {
//		
//		return buyOrderMapper.buyOrderUnchkCount();
//	}
	
	// 구매조회 탭 <확인> 목록
	public List<BuyOrderDTO> getBuyOrderCheckList() {
		
		return buyOrderMapper.buyOrderCheckList();
	}
	
	// -------------  구매 상세 페이지 --------------------------------------------------------------------------------------
	// 구매 내역 <상세> 조회
	public List<BuyOrderDetailDTO> getBuyOrderDetail(Long order_id) {
			
		return buyOrderMapper.buyOrderDetail(order_id);
	}
	
	// -------------  구매 수정 페이지 --------------------------------------------------------------------------------------
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
	    BuyStatusDTO updateStatus = Optional.ofNullable(request.getStatus()).orElse(new BuyStatusDTO()); // request.getStatus()가 null이면 새 객체를 생성해서 사용하겠다는 의미
	    updateStatus.setOrder_id((long) order_id);

	    // 상태값이 없으면 기본값 보완
	    if (updateStatus.getOrder_status() == null || updateStatus.getOrder_status().trim().isEmpty()) {
	        updateStatus.setOrder_status("미확인");
	    }

	    // 기존 상태 삭제 후 새로 등록 (중복 방지)
	    buyStatusMapper.deleteOrderStatus(updateStatus);
	    buyStatusMapper.insertOrderStatus2(updateStatus);

	    return 1; // 성공 반환 (또는 처리된 row 수 반환 가능)
	}
	
	// -------------  구매입력 페이지 --------------------------------------------------------------------------------------
	// 구매 입력 <한건의 주문정보 + 다건의 물품정보>
	@Transactional
	public void setBuyInsertAll(BuyOrderRequest request) {
		
		BuyOrderDTO order = request.getOrder();
		List<BuyOrderItemDTO> items = request.getItems();
		
		// 구매팀은 주문입력시 자동으로 '결재중' 상태로 지정
		order.setOrder_status("결재중");
		
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
	
	// -------------  구매삭제 --------------------------------------------------------------------------------------
	// 구매내역 삭제
	public String buyOrderDelete(int order_id) {	
		buyOrderMapper.buyOrderDelete(order_id);
		return "ok";
	}

	// -------------  구매현황 페이지 --------------------------------------------------------------------------------------
	// 구매 현황 <전체> 조회
	public List<BuyStatusDTO> getBuyStatusAllList() {
			
			return buyOrderMapper.buyStatusAllList();
		}

	// 구매 현황 <검색> 조회
	public List<BuyStatusDTO> getBuyStatusSearch(String start_date, String end_date, String client_code, String e_id,
            								 	 String storage_code, String item_code, String transaction_type) {
		
		 return buyOrderMapper.buyStatusSearch(start_date, end_date, client_code, e_id, storage_code, item_code, transaction_type);
	}
	
	// -------------  구매관리 - 입고조회 페이지 --------------------------------------------------------------------------------------
	// 입고 현황 <전체> 조회
	public List<BuyStockStatusDTO> getBuyStockStatusAllList() {
		
		return buyOrderMapper.getBuyStockStatusAllList();
	}
	// 입고 현황 <검색> 조회
	public List<BuyStockStatusDTO> getBuyStockStatusSearch(String start_date, String end_date, String order_id, String client_code,
			String item_code, String storage_code, String stock_amount, String safe_stock, String last_date) {
		
		return buyOrderMapper.buyStockStatusSearch(start_date, end_date, order_id, client_code, item_code, storage_code, stock_amount, safe_stock, last_date);
	}
	
}
