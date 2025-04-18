package com.spring.erp_ordit.service.warehouse;

//	import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.warehouse.LogisMapper;
import com.spring.erp_ordit.dto.warehouse.LogisOrderItemDTO;
import com.spring.erp_ordit.dto.warehouse.LogisStatusDTO;
import com.spring.erp_ordit.dto.warehouse.LogisStockDTO;

@Service
public class LogisStockItemsServiceImpl {

	@Autowired
	private LogisMapper logisMapper;
	
	// 재고 목록
	@Transactional(readOnly = true)
	public List<LogisStockDTO> logisstockList() {
		System.out.println("LogisStockItemsServiceImpl - stockList");
		List<LogisStockDTO> logisStock= logisMapper.logisStockList();
		System.out.println("logisOrder : " + logisStock);
		return logisStock;
	}
	
	// 입고 확정(stock_table 수정) 
	@Transactional  // 
	public int updateOrderStock(int stock_amount, int item_code, int storage_code, int order_id){ 
		System.out.println("LogisStockItemsServiceImpl - updateStock");
		
		System.out.println("updateStock 성공");
		// stock_tbl 업데이트
		LogisStockDTO stockDTO = LogisStockDTO.builder()
	            .stock_amount(stock_amount)
	            .item_code(item_code)
	            .storage_code(storage_code)
	            .build();
	    int result1 = logisMapper.updateStock(stockDTO);
	    System.out.println("result1 => " + result1);

		// order_item_tbl 업데이트
		LogisOrderItemDTO orderDTO = LogisOrderItemDTO.builder()
		            .item_code(item_code)
		            .order_id(order_id)
		            .build();
	    int result2 = logisMapper.updateOrderStock(orderDTO);
	    System.out.println("result2 => " + result2);
		return result1 + result2;
	}
	
	// 재고 목록 조건 조회
	public List<LogisStockDTO> logisStockSearch(String start_date, String end_date, Integer item_code, Integer client_code, Integer storage_code) {
		System.out.println("LogisOrderServiceImpl - logisStockSearch");
		System.out.println(start_date+ " " + end_date + " " +  item_code + " " +  client_code + " " +  storage_code);
		return logisMapper.logisStockSearch(start_date, end_date, item_code, client_code, storage_code);
	}
	
}
