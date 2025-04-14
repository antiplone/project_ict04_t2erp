package com.spring.erp_ordit.controller.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dao.warehouse.LogisMapper;
import com.spring.erp_ordit.dto.warehouse.LogisSalesDTO;
import com.spring.erp_ordit.service.warehouse.LogisSalesServiceImpl;

@RestController
@RequestMapping("/logissales")
@CrossOrigin(origins = "*")
public class LogisSaleslController {
	
	@Autowired
	private LogisSalesServiceImpl salesService;
	
	// 주문 목록 GetMapping = > http://localhost:logissales/api/logisSalesList
	@GetMapping("/logisSalesList") // 조회는 GetMapping
	public ResponseEntity<List<LogisSalesDTO>> logisSalesList() {
		System.out.println("<<< logisSalesList >>>");
		return new ResponseEntity<>(salesService.logisSalesList(), HttpStatus.OK);
	}
	
	@GetMapping("/salesDetail/{order_id}") // 조회는 GetMapping
	public ResponseEntity<List<LogisSalesDTO>> findBySalesId(@PathVariable int order_id) {
		System.out.println("<<< /salesDetail/{order_id} - findBySalesId >>>");
		return new ResponseEntity<>(salesService.findByLogisSalesId(order_id), HttpStatus.OK); // 200을 리턴해라
	}

	@GetMapping("/salesItemDetail") // 조회는 GetMapping
	public ResponseEntity<?> findBySalesItem(@RequestParam(required = false) Integer order_id, @RequestParam(required = false) Integer item_code, @RequestParam(required = false) Integer order_type) {
		System.out.println("<<< /salesItemDetail/{order_id} - findBySalesItem >>>");
		System.out.println("item_code : " + item_code + ", order_id : " + order_id + ", order_type : " + order_type);
		
		return new ResponseEntity<>(salesService.findBySalesItem(order_id, item_code, order_type), HttpStatus.OK); // 200을 리턴해라
	}
	
	// 출고 확정(stock_table 수정) 
//	@Transactional  // 
//	public int /*LogisStockDTO*/ updateOrderStock(int stock_amount, int item_code, int order_id, int storage_code){ // BoardDTO return : 상세페이지로 리턴하기 위해 
//		System.out.println("LogisStockItemsServiceImpl - updateStock");
//		return salesService.updateOrderStock(stock_amount, item_code, order_id, storage_code);
//	}
	
}
	
