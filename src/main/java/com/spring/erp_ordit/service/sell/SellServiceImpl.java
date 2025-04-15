package com.spring.erp_ordit.service.sell;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.sell.SellMapper;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;

@Service
public class SellServiceImpl implements SellService {
	
	@Autowired
	private SellMapper mapper;
	
	// 판매 조회, 현황 페이지 - 전체 리스트
//	@Override
//	public List<SellDTO> sellList() {
//		System.out.println("서비스 - sellList");
//		
//		return requestC_Mapper.requestClientList();
//	}
	
	// 판매_거래처 관리 - 등록
	@Override
	public int sellInsert(SellOrderDTO dto) {
		System.out.println("서비스 - sellInsert");
		System.out.println("서비스 - dto: " + dto);
		
		// 1. order_tbl에 insert
		int orderResult = mapper.sell_orderInsert(dto);
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
				
				itemResult += mapper.sell_itemInsert(item);  // insert 성공 시마다 +1
			}
			System.out.println("서비스 - itemResult: " + itemResult);
			// 총 insert된 row 수 리턴 (order 1건 + item n건)
			return 1 + itemResult;
		}
		
	}
	
	// 판매 - 1건 상세조회
//	@Override
//	public SellRequestClientDTO detailClient(int sc_no) {
//		System.out.println("서비스 - detailClient");
//		
//		return requestC_Mapper.detailClient(sc_no);
//	}
//	
//	// 판매 - 수정
//	@Override
//    public int updateClient(int sc_no, SellRequestClientDTO dto) {	// BoardDTO 리턴: 상세페이지로 리턴하기 위해
//    	
//    	return requestC_Mapper.updateClient(dto);
//    }
//	
//	// 판매 - 삭제
//	@Override
//	public String deleteClient(int sc_no) {
//		System.out.println("서비스 - deleteClient=> sc_no: " + sc_no);
//		requestC_Mapper.deleteClient(sc_no);
//		
//		return "ok";
//	}

}
