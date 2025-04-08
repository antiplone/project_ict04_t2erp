package com.spring.erp_ordit.controller.buy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.service.buy.BuyOrderServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin	// 추가  
public class BuyOrderController { // 작성자 - hjy 구매 조회 페이지
	
	@Autowired
	private BuyOrderServiceImpl buyOrderService;
	
	// 구매조회 탭 전체 목록 GetMapping => http://localhost:8081/buy/buyOrderAllList
	@GetMapping("/buyOrderAllList")
	public ResponseEntity<?> buyOrderAllList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderAllList >>>");
		
		return new ResponseEntity<>(buyOrderService.buyOrderAllList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 미확인 목록 GetMapping => http://localhost:8081/buy/buyOrderYetList
	@GetMapping("/buyOrderYetList")
	public ResponseEntity<?> buyOrderYetList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderYetList >>>");
		
		return new ResponseEntity<>(buyOrderService.buyOrderYetList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 미확인 "건수" 조회 GetMapping => http://localhost:8081/buy/buyOrderUncheckedList
	@GetMapping("/buyOrderUncheckedList")
	public ResponseEntity<?> buyOrderUncheckedList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderUncheckedList >>>");
		
		return new ResponseEntity<>(buyOrderService.buyOrderUncheckedList(), HttpStatus.OK); //200
	}
	
	// 구매 입력 PostMapping => http://localhost:8081/buy/buyOrderInsert
	@PostMapping("/buyOrderInsert")
    public ResponseEntity<?> buyOrderInsert(@RequestBody BuyOrderDTO order) {
		System.out.println("<<< buyOrderInsert >>>");
		
		return new ResponseEntity<>(buyOrderService.buyOrderInsert(order), HttpStatus.CREATED);
    }
	
	
//	// 구매 주문 등록 PostMapping => http://localhost:8081/main/insertBuyOrder
//	@PostMapping("/insertBuyOrder")
//    public ResponseEntity<?> saveBuyOrder(@RequestBody OrderDTO order) {
//		System.out.println("<<< insertBuyOrder >>>");
//		
//		return new ResponseEntity<>(buyOrderService.saveBuyOrder(order), HttpStatus.CREATED);
//    }
	
}
