package com.spring.erp_ordit.service.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.warehouse.LogisMapper;
import com.spring.erp_ordit.dto.warehouse.*;

@Service
public class LogisSalesServiceImpl {

@Autowired
private LogisMapper logisMapper;
	
	// 출고 목록	
	@Transactional(readOnly=true)
	public List<LogisSalesDTO> logisSalesList(){
		System.out.println("LogisSalesServiceImpl - logisSalesList");
		return logisMapper.logisSalesList();
	}
	
	// 출고 상세
	@Transactional(readOnly=true)
	public List<LogisSalesDTO> findByLogisSalesId(int order_id){
		System.out.println("LogisSalesServiceImpl - findByLogisSalesId");
		return logisMapper.findByLogisSalesId(order_id);
	}

	// 출고 아이템 상세
	@Transactional(readOnly=true)
	public LogisSalesItemDTO findBySalesItem(int order_id, int item_code, int order_type){
		System.out.println("LogisSalesServiceImpl - findBySalesItem");
		 // MyBatis를 통해 LogisOrderDTO 객체를 찾음
		LogisSalesItemDTO sorderDTO = logisMapper.findBySalesItem(order_id, item_code, order_type);
	    
	    // sorderDTO가 null인 경우 예외 처리하거나 적절한 메시지를 반환할 수 있음
	    if (sorderDTO == null) {
	        System.out.println("Order not found for order_id: " + order_id + " and item_code: " + item_code+ " and order_type: " + order_type );
	        return null; // 혹은 예외 처리
	    }
		return sorderDTO;
	}
	
	// 출고 목록 조건 조회
	public List<LogisStatusDTO> logisSalesSearch(String start_date, String end_date, String client_code, String e_id, Integer storage_code) {
		System.out.println("LogisSalesServiceImpl - logisSalesSearch");
		System.out.println(start_date+ " " + end_date + " " +  client_code + " " +  e_id + " " +  storage_code);
		return logisMapper.logisSalesSearch(start_date, end_date, client_code, e_id, storage_code);
	}

}
