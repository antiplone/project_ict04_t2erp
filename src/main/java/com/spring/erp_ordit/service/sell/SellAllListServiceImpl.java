package com.spring.erp_ordit.service.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.sell.SellAllListMapper;
import com.spring.erp_ordit.dto.sell.SellAllListDTO;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;

@Service
public class SellAllListServiceImpl implements SellAllListService {
	
	@Autowired
	private SellAllListMapper Mapper;
	
	// 판매 입력 - 등록
	@Override
	public int sellInsert(SellOrderDTO dto) {
	System.out.println("서비스 - sellInsert");
	System.out.println("서비스 - dto: " + dto);
	
	// 1. order_tbl에 insert
	int orderResult = Mapper.sell_orderInsert(dto);
	System.out.println("서비스 - orderResult: " + orderResult);
	
	// insert 실패 시 바로 false 리턴
	if (orderResult == 0) {
		
		return 0;
	}
	else {
		// 2. order_tbl에 입력된 order_id 값 가져오기
		int order_id = dto.getOrder_id();
		
		int itemResult = 0;
		System.out.println("서비스 - order_id : " + order_id);
		// 3. order_item_tbl에 insert
		for (SellOrderItemDTO item : dto.getOrderItemList()) {
			item.setOrder_id(order_id);
			System.out.println("서비스 - item : " + item);
			
			itemResult += Mapper.sell_itemInsert(item);  // insert 성공 시마다 +1
			
			if (itemResult == 0) {
				return 0;
			}
			else {
				Mapper.sell_approvalInsert(order_id);
			}
		}
		System.out.println("서비스 - itemResult: " + itemResult);
		// 총 insert된 row 수 리턴 (order 1건 + item n건)
		return 1 + itemResult;
		}
	}
		
	// 판매 조회, 판매 현황 - 판매 입력한 전체 리스트
	@Override
	public List<SellAllListDTO> sellAllList() {
		System.out.println("서비스 - sellAllList");
		
		return Mapper.sellAllList();
	}
	
	// 판매 현황 - 검색 후 나오는 전체 리스트
	@Override
	public List<SellAllListDTO> sellStatusSearchList(SellAllListDTO dto) {
		System.out.println("서비스 - sellStatusSearchList");
		
		return Mapper.sellStatusSearchList(dto);
	}
	
	
	// 판매 조회 - 1건 상세 조회
	@Override
	public List<SellAllListDTO> detailAllList(int order_id) {
		System.out.println("서비스 - detailAllList");
		
		
		System.out.println("서비스 - SellAllListDTO" + Mapper.detailAllList(order_id));
		
		return Mapper.detailAllList(order_id);
	}
	
	// 판매 조회 - 수정
	@Override
	public int updateAllList(int order_id, SellOrderDTO dto) {
		System.out.println("서비스 - updateAllList");

		// 입력받지 못한 order_id를 dto에 넣기
		dto.setOrder_id(order_id);

		// 1. order_tbl에 update
		int orderResult = Mapper.updateAllList_order(dto);
		System.out.println("서비스 - orderResult: " + orderResult);
		
		// update 실패 시 바로 false 리턴
		if (orderResult == 0) {
			
			return 0;
		}
		else {
			int itemResult = 0;

			// 2. order_item_tbl에 update
			for (SellOrderItemDTO item : dto.getOrderItemList()) {
				item.setOrder_id(order_id);
				System.out.println("서비스 - item : " + item);
				
				itemResult += Mapper.updateAllList_item(item);  // update 성공 시마다 +1
			}
			
			System.out.println("서비스 - itemResult: " + itemResult);
			
			// 총 insert된 row 수 리턴 (order 1건 + item n건)
			return 1 + itemResult;
		}
	}
	
	// 판매 조회 - 삭제
	@Override
	public String deleteAllList(int order_id) {
		System.out.println("서비스 - deleteAllList");
		System.out.println("서비스 - order_id : " + order_id);
		Mapper.deleteAllList(order_id);
		
		return "ok";
	}

	
}
