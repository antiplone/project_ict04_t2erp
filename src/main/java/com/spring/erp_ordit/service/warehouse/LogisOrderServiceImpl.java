package com.spring.erp_ordit.service.warehouse;

//	import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import com.spring.erp_ordit.dao.warehouse.*;
import com.spring.erp_ordit.dto.warehouse.LogisOrderDTO;
import com.spring.erp_ordit.dto.warehouse.LogisSalesDTO;
import com.spring.erp_ordit.dto.warehouse.LogisOrderItemDTO;

@Service
public class LogisOrderServiceImpl {

	@Autowired
	private LogisMapper logisMapper;
		
	// 입고 목록	
	@Transactional(readOnly=true)
	public List<LogisOrderDTO> logisOrderList(){
		System.out.println("LogisOrderServiceImpl - orderList");
		List<LogisOrderDTO> logisOrder = logisMapper.logisOrderList();
		System.out.println("logisOrder : " + logisOrder);
		return logisOrder;
	}
	
	// 입고 상세
	@Transactional(readOnly=true)
	public List<LogisOrderDTO> findByLogisOrderId(int order_id){
		System.out.println("LogisOrderServiceImpl - findByLogisOrderId");
		return logisMapper.findByLogisOrderId(order_id);
	}
	
<<<<<<< Updated upstream
	// 입출고 아이템 상세
=======
	// 입고 아이템 상세
>>>>>>> Stashed changes
	@Transactional(readOnly=true)
	public LogisOrderItemDTO findByOrderItem(int order_id, int item_code, int order_type){
		System.out.println("LogisOrderServiceImpl - findByOrderItem");
		 // MyBatis를 통해 LogisOrderDTO 객체를 찾음
		LogisOrderItemDTO orderDTO = logisMapper.findByOrderItem(order_id, item_code, order_type);
	    
	    // orderDTO가 null인 경우 예외 처리하거나 적절한 메시지를 반환할 수 있음
	    if (orderDTO == null) {
	        System.out.println("Order not found for order_id: " + order_id + " and item_code: " + item_code+ " and order_type: " + order_type );
	        return null; // 혹은 예외 처리
	    }
		return orderDTO;
	}
	



}
