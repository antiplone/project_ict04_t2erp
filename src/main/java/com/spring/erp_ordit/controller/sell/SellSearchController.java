package com.spring.erp_ordit.controller.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.sell.SellSearchClientDTO;
import com.spring.erp_ordit.dto.sell.SellSearchDTO;
import com.spring.erp_ordit.dto.sell.SellSearchEmployeeDTO;
import com.spring.erp_ordit.dto.sell.SellSearchStorageDTO;
import com.spring.erp_ordit.service.sell.SellSearchServiceImpl;

@RestController
@RequestMapping("/search")
@CrossOrigin
public class SellSearchController {
	
	@Autowired
	private SellSearchServiceImpl service;
	
	// http://localhost:8081/search/sellItemList
	// 판매 물품 검색 - 물품 리스트
	@GetMapping("/sellItemList")
	public ResponseEntity<List<SellSearchDTO>> sell_searchList() {
		System.out.println("<<< sell_searchList >>>");

		return new ResponseEntity<>(service.sellSearchList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/search/sellItem
	// 판매 - 품목명 리스트 모달
	@GetMapping("/sellItem")
	public ResponseEntity<List<SellSearchDTO>> search_itemList() {
		System.out.println("<<< search_itemList >>>");

		return new ResponseEntity<>(service.sellItemList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/search/sellClient
	// 판매 - 거래처 조회 모달
	@GetMapping("/sellClient")
	public ResponseEntity<List<SellSearchClientDTO>> search_clientList() {
		System.out.println("<<< search_clientList >>>");

		return new ResponseEntity<>(service.sellClientList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/search/sellEmployee
	// 판매 - 담당자 조회 모달
	@GetMapping("/sellEmployee")
	public ResponseEntity<List<SellSearchEmployeeDTO>> search_employeeList() {
		System.out.println("<<< search_employeeList >>>");

		return new ResponseEntity<>(service.sellEmployeeList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/search/sellStorage
	// 판매 - 담당자 조회 모달
	@GetMapping("/sellStorage")
	public ResponseEntity<List<SellSearchStorageDTO>> search_storageList() {
		System.out.println("<<< search_storageList >>>");

		return new ResponseEntity<>(service.sellWarehouseList(), HttpStatus.OK);
	}
	
}
