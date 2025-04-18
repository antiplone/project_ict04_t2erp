package com.spring.erp_ordit.controller.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.sell.SellAllListDTO;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.service.sell.SellAllListServiceImpl;

@RestController
@RequestMapping("/sell")
@CrossOrigin
public class SellAllListController {
	
	@Autowired
	private SellAllListServiceImpl service;
	
	
	// http://localhost:8081/sell/insert
	// 판매 입력 - 등록 요청
	@PostMapping("/insert")
	public ResponseEntity<Integer> sell_insert(@RequestBody SellOrderDTO dto) {
		System.out.println("<<< sell_insert >>>");

		return new ResponseEntity<>(service.sellInsert(dto), HttpStatus.CREATED);
	}
		
	// http://localhost:8081/sell/allList
	// 판매 조회, 판매 현황 - 판매 입력한 전체 리스트
	@GetMapping("/allList")
	public ResponseEntity<List<SellAllListDTO>> sell_allList() {
		System.out.println("<<< sell_allList >>>");

		return new ResponseEntity<>(service.sellAllList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/statusSearchList
	// 판매 현황 - 검색 후 나오는 전체 리스트
	@PostMapping("/statusSearchList")
	public ResponseEntity<List<SellAllListDTO>> sell_statusSearchList(@RequestBody SellAllListDTO dto) {
		System.out.println("<<< sell_statusSearchList >>>");
		System.out.println("<<< dto : >>>" + dto);

		return new ResponseEntity<>(service.sellStatusSearchList(dto), HttpStatus.OK);
	}
		
	// http://localhost:8081/sell/allDetail
	// 판매 조회 - 1건 상세 조회
	@GetMapping("/allDetail/{order_id}")
	public ResponseEntity<List<SellAllListDTO>> detail_allList(@PathVariable int order_id) {
		System.out.println("<<< detail_allList >>>");
		
		return new ResponseEntity<List<SellAllListDTO>>(service.detailAllList(order_id), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/allListUpdate/{order_id}
	// 판매 조회 - 입력 건 수정
	@PutMapping("/allListUpdate/{order_id}")
		public ResponseEntity<Integer> update_allList(@PathVariable int order_id, @RequestBody SellOrderDTO dto) {
		System.out.println("<<< update_allList >>>");

		return new ResponseEntity<>(service.updateAllList(order_id, dto), HttpStatus.OK);
	}
		
	// http://localhost:8081/sell/allDelete/{order_id}
	// 판매 조회 - 삭제
	@DeleteMapping("/allDelete/{order_id}")
	public ResponseEntity<?> delete_allList(@PathVariable int order_id) {
		System.out.println("<<< delete_allList >>> order_id: " + order_id);
		
		return new ResponseEntity<>(service.deleteAllList(order_id), HttpStatus.OK);	// 200
		
	}
		
}
