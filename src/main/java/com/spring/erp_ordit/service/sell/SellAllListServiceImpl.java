package com.spring.erp_ordit.service.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyItemMapper;
import com.spring.erp_ordit.dao.sell.SellAllListMapper;
import com.spring.erp_ordit.dao.sell.SellItemMapper;
import com.spring.erp_ordit.dto.sell.SellAllListDTO;
import com.spring.erp_ordit.dto.sell.SellInvocieDTO;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;

@Service
public class SellAllListServiceImpl implements SellAllListService {
	
	@Autowired
	private SellAllListMapper Mapper;
	
	@Autowired
	private SellItemMapper sellItemMapper;
	
	// 판매 입력 - 등록
	@Override
	@Transactional
	public int sellInsert(SellOrderDTO dto) {
	
	// 1. order_tbl에 insert
	int orderResult = Mapper.sell_orderInsert(dto);
	
	// insert 실패 시 바로 false 리턴
	if (orderResult == 0) {
		return 0;
	}
	else {
		// 2. order_tbl에 입력된 order_id 값 가져오기
		int order_id = dto.getOrder_id();
//		System.out.println("서비스 - order_id : " + order_id);
		int itemResult = 0;
		// 3. order_item_tbl에 insert
		for (SellOrderItemDTO item : dto.getOrderItemList()) {
			item.setOrder_id(order_id);
			
			// item_code로 item_id 조회하여 자동 설정 => 못찾으면 예외 발생하고 @Transactional에 의해 롤백됨. => @Transactional으로 롤백 안하면 데이터가 부분만 저장되는 비정상 상태가 됨.
			if (item.getItem_id() == null && 
				item.getItem_code() != null && 
				!item.getItem_code().toString().trim().isEmpty()) {
				
				Long item_id = sellItemMapper.findItemIdByCode(item.getItem_code().toString());
				if (item_id == null) {
					throw new RuntimeException("해당 item_code의 item_id를 찾을 수 없습니다: " + item.getItem_code());
				}
				item.setItem_id(item_id);
//				System.out.println("서비스 - item_id : " + item_id);
				
				itemResult += Mapper.sell_itemInsert(item);  // insert 성공 시마다 +1
				
				if (itemResult == 0) {
					return 0;
				}
				else {
					Mapper.sell_approvalInsert(order_id);
				}
			}
		}
//		System.out.println("서비스 - itemResult: " + itemResult);
		// 총 insert된 row 수 리턴 (order 1건 + item n건)
		return 1 + itemResult;
		}
	}
		
	// 판매 조회, 판매 현황 - 판매 입력한 전체 리스트
	@Override
	@Transactional(readOnly=true)
	public List<SellAllListDTO> sellAllList() {
//		System.out.println("서비스 - sellAllList");
		
		return Mapper.sellAllList();
	}
	
	// 판매 현황 - 검색 후 나오는 전체 리스트
	@Override
	@Transactional(readOnly=true)
	public List<SellAllListDTO> sellStatusSearchList(SellAllListDTO dto) {
//		System.out.println("서비스 - sellStatusSearchList");
		
		return Mapper.sellStatusSearchList(dto);
	}
	
	
	// 판매 조회 - 1건 상세 조회
	@Override
	@Transactional(readOnly=true)
	public List<SellAllListDTO> detailAllList(int order_id) {
//		System.out.println("서비스 - detailAllList");
		
		return Mapper.detailAllList(order_id);
	}
	
	// 판매 조회 - 수정
	@Override
	@Transactional
	public int updateAllList(int order_id, SellOrderDTO dto) {
//		System.out.println("서비스 - updateAllList");
		
		int result = 1; // 성공을 기본값으로 시작
		
		// 주문번호 저장
	    dto.setOrder_id(order_id);

	    int orderResult = Mapper.updateAllList_order(dto);
	    if (orderResult == 0) {
	        return 0; // 주문 정보 수정 실패
	    }

	    // 삭제 처리
	    if (dto.getDeletedItemIds() != null) {
	        for (Integer deletedId : dto.getDeletedItemIds()) {
	            int deleteResult = Mapper.deleteOrderItem(deletedId);
	            if (deleteResult == 0) {
	                result = 0; // 삭제 실패 시 실패로 표시
	            }
	        }
	    }

	    // 상세 항목 추가/수정
	    for (SellOrderItemDTO item : dto.getOrderItemList()) {
	        item.setOrder_id(order_id);
	        
	        // 아이템 추가/수정 작업의 결과값
	        int itemOpResult = 0;
	        
	        // 새로운 아이템 추가 시
	        if (item.getOrder_item_id() == null || item.getOrder_item_id().equals(0)) {
	            
	        	// item_code로 item_id 조회하여 자동 설정 => 못찾으면 예외 발생하고 @Transactional에 의해 롤백됨. => @Transactional으로 롤백 안하면 데이터가 부분만 저장되는 비정상 상태가 됨.
				if (item.getItem_id() == null && 
					item.getItem_code() != null && 
					!item.getItem_code().toString().trim().isEmpty()) {
					
					Long item_id = sellItemMapper.findItemIdByCode(item.getItem_code().toString());
					if (item_id == null) {
						throw new RuntimeException("해당 item_code의 item_id를 찾을 수 없습니다: " + item.getItem_code());
					}
					item.setItem_id(item_id);
					System.out.println("서비스 - item_id : " + item_id);
				}
	        	
	        	itemOpResult = Mapper.sell_itemInsert(item);
	        } else {	// 기존 아이템 수정 시
	            itemOpResult = Mapper.updateAllList_item(item);
	        }

	        if (itemOpResult == 0) {
	            result = 0; // 하나라도 실패하면 실패로 표시
	        }
	    }

	    return result;
	}
	
	// 판매 조회 - 삭제
	@Override
	@Transactional
	public String deleteAllList(int order_id) {
//		System.out.println("서비스 - deleteAllList");
		
		Mapper.deleteAllList(order_id);
		return "ok";
	}
	
	// 판매 조회 - 거래명세서 조회
	@Override
	@Transactional
	public List<SellInvocieDTO> detailInvocie(int order_id) {
//		System.out.println("서비스 - detailInvocie");
		
		return Mapper.detailInvocie(order_id);
	}

	
}
