package com.spring.erp_ordit.controller.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.sell.SellAllListDTO;
import com.spring.erp_ordit.service.sell.SellAllListServiceImpl;

@RestController
@RequestMapping("/sell")
@CrossOrigin
public class SellAllListController {
	
	@Autowired
	private SellAllListServiceImpl service;
	
	// http://localhost:8081/sell/allList
	// 판매 조회 - 판매 입력한 전체 리스트
	@GetMapping("/allList")
	public ResponseEntity<List<SellAllListDTO>> sell_allList() {
		System.out.println("<<< sell_allList >>>");

		return new ResponseEntity<>(service.sellAllList(), HttpStatus.OK);
	}
	
//	// http://localhost:8081/sell/searchItem
//	// 판매 - 품목명 리스트 모달
//	@GetMapping("/searchItem")
//	public ResponseEntity<List<SellSearchDTO>> search_itemList() {
//		System.out.println("<<< search_itemList >>>");
//
//		return new ResponseEntity<>(service.sellItemList(), HttpStatus.OK);
//	}
//	
//	// http://localhost:8081/sell/searchClient
//	// 판매 - 거래처 조회 모달
//	@GetMapping("/searchClient")
//	public ResponseEntity<List<SellSearchClientDTO>> search_clientList() {
//		System.out.println("<<< search_clientList >>>");
//
//		return new ResponseEntity<>(service.sellClientList(), HttpStatus.OK);
//	}
//	
//	// http://localhost:8081/sell/searchEmployee
//	// 판매 - 담당자 조회 모달
//	@GetMapping("/searchEmployee")
//	public ResponseEntity<List<SellSearchEmployeeDTO>> search_employeeList() {
//		System.out.println("<<< search_employeeList >>>");
//
//		return new ResponseEntity<>(service.sellEmployeeList(), HttpStatus.OK);
//	}
//	
//	// http://localhost:8081/sell/searchStorage
//	// 판매 - 담당자 조회 모달
//	@GetMapping("/searchStorage")
//	public ResponseEntity<List<SellSearchStorageDTO>> search_storageList() {
//		System.out.println("<<< search_storageList >>>");
//
//		return new ResponseEntity<>(service.sellWarehouseList(), HttpStatus.OK);
//	}
	
}
