package com.spring.erp_ordit.controller.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.warehouse.LogisOrderDTO;
import com.spring.erp_ordit.dto.warehouse.LogisSalesDTO;
import com.spring.erp_ordit.service.warehouse.LogisOrderServiceImpl;
import com.spring.erp_ordit.service.warehouse.LogisSalesServiceImpl;

@RestController
@RequestMapping("/warehouse")
@CrossOrigin
public class LogisOrderlController {
	
	@Autowired
	private LogisOrderServiceImpl orderService;
	
	// 주문 목록 GetMapping = > http://localhost:8081/api/WarehouseList
	@GetMapping("/logisOrderList") // 조회는 GetMapping
	public ResponseEntity<List<LogisOrderDTO>> logisOrderList() {
		System.out.println("<<< logisorderList >>>");
		return new ResponseEntity<>(orderService.logisOrderList(), HttpStatus.OK);
	}
	
	@GetMapping("/orderDetail/{order_id}") // 조회는 GetMapping
	public ResponseEntity<List<LogisOrderDTO>> findByOrderId(@PathVariable int order_id) {
		System.out.println("<<< /orderDetail/{order_id} - findByOrderid >>>");
		return new ResponseEntity<>(orderService.findByLogisOrderId(order_id), HttpStatus.OK); // 200을 리턴해라
	}
//	
//	@GetMapping("/orderItemDetail/{order_id}") // 조회는 GetMapping
//	public ResponseEntity<?> findByOrderItem(@PathVariable int order_id, @RequestParam(value = "item_code", required = false) Integer item_code) {
//		System.out.println("<<< /orderItemDetail/{order_id} - findByOrderItem >>>");
//		System.out.println("item_code : " + item_code + ", stock_amount : " + order_id );
//		
//		return new ResponseEntity<>(orderService.findByOrderItem(order_id, item_code), HttpStatus.OK); // 200을 리턴해라
//	}
	
	@Autowired
	private LogisSalesServiceImpl salesService;
	
	// 주문 목록 GetMapping = > http://localhost:8081/api/WarehouseList
	@GetMapping("/logisSalesList") // 조회는 GetMapping
	public ResponseEntity<List<LogisSalesDTO>> logisSalesList() {
		System.out.println("<<< logisSalesList >>>");
		return new ResponseEntity<>(salesService.logisSalesList(), HttpStatus.OK);
	}
}
	
