package com.spring.erp_ordit.controller.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.sell.SellSearchClientDTO;
import com.spring.erp_ordit.dto.sell.SellSearchDTO;
import com.spring.erp_ordit.dto.sell.SellSearchEmployeeDTO;
import com.spring.erp_ordit.dto.sell.SellSearchStorageDTO;
import com.spring.erp_ordit.service.sell.SellSearchServiceImpl;

@RestController
@RequestMapping("/sell")
@CrossOrigin
public class SellSearchController {
	
	@Autowired
	private SellSearchServiceImpl service;
	
	// http://localhost:8081/sell/searchItemList
	// 판매 물품 검색 - 물품 리스트
	@GetMapping("/searchItemList")
	public ResponseEntity<List<SellSearchDTO>> sell_searchList() {
		System.out.println("<<< sell_searchList >>>");

		return new ResponseEntity<>(service.sellSearchList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchResultItemList
	// 판매 물품 검색 - 원하는 품목 선택 검색한 물품 리스트
	@PostMapping("/searchResultItemList")
	public ResponseEntity<List<SellSearchDTO>> sell_searchResultList(@RequestBody SellSearchDTO dto) {
		System.out.println("<<< sell_searchResultList >>>");

		return new ResponseEntity<>(service.sellSearchResultList(dto), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchDetailItemList
	// 판매 - 품목명 리스트 모달(키워드로 검색)
	@GetMapping("/searchDetailItemList/{keyword}")
	public ResponseEntity<List<SellSearchDTO>> searchDetail_itemList(@PathVariable String keyword) {
		System.out.println("<<< sell_searchDetailItemList >>>");

		return new ResponseEntity<>(service.sellSearchItemDetailList(keyword), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchItem
	// 판매 - 품목명 리스트 모달
	@GetMapping("/searchItem")
	public ResponseEntity<List<SellSearchDTO>> search_itemList() {
		System.out.println("<<< search_itemList >>>");

		return new ResponseEntity<>(service.sellItemList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchItemCount/{storage_code}/{keyword}
	// 판매 입력 - 창고 선택 시 조회되는 품목 리스트 모달 (키워드로 검색)
	@GetMapping("/searchItemCount/{storage_code}/{keyword}")
	public ResponseEntity<List<SellSearchDTO>> storage_itemListKey(@PathVariable int storage_code, @PathVariable String keyword) {
		System.out.println("<<< storage_itemListKey >>>");

		return new ResponseEntity<>(service.storage_itemListKey(storage_code, keyword), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchItemCode/{storage_code}
	// 판매 입력 - 창고 선택 시 조회되는 품목 리스트 모달
	@GetMapping("/searchItemCode/{storage_code}")
	public ResponseEntity<List<SellSearchDTO>> storage_itemList(@PathVariable int storage_code) {
		System.out.println("<<< storage_itemList >>>");
		
		return new ResponseEntity<>(service.storage_itemList(storage_code), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchDetailClient/{keyword}
	// 판매 - 거래처 조회 모달(키워드로 검색)
	@GetMapping("/searchDetailClient/{keyword}")
	public ResponseEntity<List<SellSearchClientDTO>> searchDetail_clientList(@PathVariable String keyword) {
		System.out.println("<<< search_clientList >>>");

		return new ResponseEntity<>(service.sellSearchClientDetailList(keyword), HttpStatus.OK);
	}
		
	// http://localhost:8081/sell/searchClient
	// 판매 - 거래처 조회 모달
	@GetMapping("/searchClient")
	public ResponseEntity<List<SellSearchClientDTO>> search_clientList() {
		System.out.println("<<< search_clientList >>>");

		return new ResponseEntity<>(service.sellClientList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchDetailEmployee/{keyword}
	// 판매 - 담당자 조회 모달(키워드로 검색)
	@GetMapping("/searchDetailEmployee/{keyword}")
	public ResponseEntity<List<SellSearchEmployeeDTO>> searchDetail_employeeList(@PathVariable String keyword) {
		System.out.println("<<< searchDetail_employeeList >>>");

		return new ResponseEntity<>(service.sellSearchEmployeeDetailList(keyword), HttpStatus.OK);
	}
		
	// http://localhost:8081/sell/searchEmployee
	// 판매 - 담당자 조회 모달
	@GetMapping("/searchEmployee")
	public ResponseEntity<List<SellSearchEmployeeDTO>> search_employeeList() {
		System.out.println("<<< search_employeeList >>>");

		return new ResponseEntity<>(service.sellEmployeeList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchDetailStorage/{keyword}
	// 판매 - 창고 조회 모달(키워드로 검색)
	@GetMapping("/searchDetailStorage/{keyword}")
	public ResponseEntity<List<SellSearchStorageDTO>> searchDetail_storageList(@PathVariable String keyword) {
		System.out.println("<<< searchDetail_storageList >>>");

		return new ResponseEntity<>(service.sellWarehouseDetailList(keyword), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/searchStorage
	// 판매 - 창고 조회 모달
	@GetMapping("/searchStorage")
	public ResponseEntity<List<SellSearchStorageDTO>> search_storageList() {
		System.out.println("<<< search_storageList >>>");
		
		return new ResponseEntity<>(service.sellWarehouseList(), HttpStatus.OK);
	}
	
}
