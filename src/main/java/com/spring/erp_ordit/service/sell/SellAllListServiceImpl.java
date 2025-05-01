package com.spring.erp_ordit.service.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.sell.SellAllListMapper;
import com.spring.erp_ordit.dto.sell.SellAllListDTO;
import com.spring.erp_ordit.dto.sell.SellInvocieDTO;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;

@Service
public class SellAllListServiceImpl implements SellAllListService {
	
	@Autowired
	private SellAllListMapper Mapper;
	
	// 판매 입력 - 등록
	@Override
	@Transactional
	public int sellInsert(SellOrderDTO dto) {
//	System.out.println("서비스 - sellInsert");
	
	// 1. order_tbl에 insert
	int orderResult = Mapper.sell_orderInsert(dto);
	
	// insert 실패 시 바로 false 리턴
	if (orderResult == 0) {
		return 0;
	}
	else {
		// 2. order_tbl에 입력된 order_id 값 가져오기
		int order_id = dto.getOrder_id();
		
		int itemResult = 0;
		// 3. order_item_tbl에 insert
		for (SellOrderItemDTO item : dto.getOrderItemList()) {
			item.setOrder_id(order_id);
			
			itemResult += Mapper.sell_itemInsert(item);  // insert 성공 시마다 +1
			
			if (itemResult == 0) {
				return 0;
			}
			else {
				Mapper.sell_approvalInsert(order_id);
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

			dto.setOrder_id(order_id);

			int orderResult = Mapper.updateAllList_order(dto);
			if (orderResult == 0) {
				return 0;
			}

			int itemResult = 0;

			//  1. 삭제 처리 먼저 (루프 밖에서)
			if (dto.getDeletedItemIds() != null) {
			    for (Integer deletedId : dto.getDeletedItemIds()) {
			        Mapper.deleteOrderItem(deletedId);
			    }
			}

			//  2. 추가/수정 루프
			for (SellOrderItemDTO item : dto.getOrderItemList()) {
				item.setOrder_id(order_id);

				// 추가 (새로운 항목)
				if (item.getOrder_item_id() == null 
					    || item.getOrder_item_id().equals(0)) {
					itemResult += Mapper.sell_itemInsert(item);
				}
				// 수정 (기존 항목)
				else {
					itemResult += Mapper.updateAllList_item(item);
				}
			
			}

			return 1 + itemResult;
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
