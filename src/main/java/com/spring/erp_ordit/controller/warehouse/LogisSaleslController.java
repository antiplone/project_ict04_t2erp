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

import com.spring.erp_ordit.dto.warehouse.LogisSalesDTO;
import com.spring.erp_ordit.service.warehouse.LogisSalesServiceImpl;

@RestController
@RequestMapping("/logissales")
@CrossOrigin
public class LogisSaleslController {
	
	@Autowired
	private LogisSalesServiceImpl salesService;
	
	// 주문 목록 GetMapping = > http://localhost:8081/api/WarehouseList
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
	public ResponseEntity<?> findBySalesItem( @RequestParam(required = false) Integer order_id, @RequestParam(required = false) Integer item_code, @RequestParam(required = false) Integer order_type) {
		System.out.println("<<< /salesItemDetail/{order_id} - findBySalesItem >>>");
		System.out.println("item_code : " + item_code + ", order_id : " + order_id + ", order_type : " + order_type);
		
		return new ResponseEntity<>(salesService.findBySalesItem(order_id, item_code, order_type), HttpStatus.OK); // 200을 리턴해라
	}
	
}
	
