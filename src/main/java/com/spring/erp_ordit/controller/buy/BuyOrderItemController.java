package com.spring.erp_ordit.controller.buy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.service.buy.BuyOrderItemServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin	// 추가  
public class BuyOrderItemController {	// 작성자: hjy - 구매 물품 입력 
	
	@Autowired
	private BuyOrderItemServiceImpl service;
	
	// 구매물품 목록 GetMapping => http://localhost:8081/buy/buyOrderItemList
	@GetMapping("/buyOrderItemList")
	public ResponseEntity<?> buyOrderItemList() {	 
		System.out.println("<<< buyOrderItemList >>>");
		
		return new ResponseEntity<>(service.buyOrderItemList(), HttpStatus.OK); //200
	}
	
	// 구매물품 등록 PostMapping => http://localhost:8081/buy/buyOrderItemInsert
	@PostMapping("/buyOrderItemInsert")
	public ResponseEntity<?> buyOrderItemInsert(@RequestBody BuyOrderItemDTO item) {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderItemInsert >>>");
		
		return new ResponseEntity<>(service.buyOrderItemInsert(item), HttpStatus.CREATED); // 201 // <>를 주면 위에 있는 <Integer>안에 있는게 그대로 적용된다.
	}
	
//	// 구매물품 상세 GetMapping => http://localhost:8081/buy/buyOrderItem/{order_id}
//	@GetMapping("/buyOrderItem/{order_id}")
//	public ResponseEntity<?> buyOrderItemDetail(@PathVariable Integer order_id) {
//		System.out.println("<<< buyOrderItemDetail >>>");
//		
//		return new ResponseEntity<BuyOrderItemDTO>(service.buyOrderItemDetail(order_id), HttpStatus.OK);	// 200
//	}
	
	// 구매물품 삭제 DeleteMapping => http://localhost:8081/buy/buyOrderItem/{order_id}
	@DeleteMapping("/buyOrderItem/{order_id}")
	public ResponseEntity<?> buyOrderItemDelete(@PathVariable int order_id){
		System.out.println("<<< buyOrderItemDelete >>>");
		
		return new ResponseEntity<String>(service.buyOrderItemDelete(order_id), HttpStatus.OK);	// 200
	}
	
//	// 게시글 수정 PutMapping => http://localhost:8081/api/orderItem/{order_id}
//	@PutMapping("/orderItem/{order_id}")
//	public ResponseEntity<?> updateOrder(@PathVariable int order_id, @RequestBody ItemDTO orderItem){
//		System.out.println("<<< updateOrder >>>");
//		
//		return new ResponseEntity<>(service.updateOrder(order_id, orderItem), HttpStatus.OK);	// 200
//	}
	
}
