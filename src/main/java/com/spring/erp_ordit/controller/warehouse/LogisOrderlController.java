package com.spring.erp_ordit.controller.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.warehouse.LogisOrderDTO;
import com.spring.erp_ordit.service.warehouse.LogisOrderServiceImpl;

@RestController
@RequestMapping("/logisorder")
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
	
	@GetMapping("/orderItemDetail") // 조회는 GetMapping
	public ResponseEntity<?> findByOrderItem( @RequestParam(required = false) Integer order_id, @RequestParam(required = false) Integer item_code, @RequestParam(required = false) Integer order_type) {
		System.out.println("<<< /orderItemDetail/{order_id} - findByOrderItem >>>");
		System.out.println("item_code : " + item_code + ", order_id : " + order_id + ", order_type : " + order_type);
		
		return new ResponseEntity<>(orderService.findByOrderItem(order_id, item_code, order_type), HttpStatus.OK); // 200을 리턴해라
	}
	
}
	
