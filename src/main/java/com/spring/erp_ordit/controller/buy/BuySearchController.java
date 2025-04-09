package com.spring.erp_ordit.controller.buy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.service.buy.BuySearchServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin	// 추가  
public class BuySearchController { 	// 작성자: hjy - 모달 검색 담당자,거래처 목록 
	
	@Autowired
	private BuySearchServiceImpl searchService;

	// 담당자 목록 GetMapping =>  http://localhost:8081/buy/buyInchargeList
	@GetMapping("/buyInchargeList")
	public ResponseEntity<?> buyInchargeList() {
		System.out.println("<<< buyInchargeList >>>");
		
		return new ResponseEntity<>(searchService.buyInchargeList(), HttpStatus.OK);	//200
	}
	
	// 거래처 목록 GetMapping =>  http://localhost:8081/buy/buyClientList
	@GetMapping("/buyClientList")
	public ResponseEntity<?> buyClientList() {
		System.out.println("<<< buyClientList >>>");
		
		return new ResponseEntity<>(searchService.buyClientList(), HttpStatus.OK);	//200
	}
	
	// 입고창고 목록 GetMapping =>  http://localhost:8081/buy/buyStorageList
	@GetMapping("/buyStorageList")
	public ResponseEntity<?> buyStorageList() {
		System.out.println("<<< buyStorageList >>>");
		
		return new ResponseEntity<>(searchService.buyStorageList(), HttpStatus.OK);	//200
	}
	
	// 물품 목록 GetMapping =>  http://localhost:8081/buy/buyItemList
	@GetMapping("/buyItemList")
	public ResponseEntity<?> buyItemList() {
		System.out.println("<<< buyItemList >>>");
		
		return new ResponseEntity<>(searchService.buyItemList(), HttpStatus.OK);	//200
	}
	
}
