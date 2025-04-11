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

import com.spring.erp_ordit.dto.sell.SellOrderDTO;
import com.spring.erp_ordit.dto.sell.SellRequestClientDTO;
import com.spring.erp_ordit.service.sell.SellRequestClientServiceImpl;
import com.spring.erp_ordit.service.sell.SellServiceImpl;

@RestController
@RequestMapping("/sell")
@CrossOrigin
public class SellController {
	
	@Autowired
	private SellServiceImpl service;
	
	// http://localhost:8081/sell/list
	// 판매_거래처 관리 - 요청리스트
//	@GetMapping("/list")
//	public ResponseEntity<List<SellDTO>> list() {
//		System.out.println("<<< reqClientList >>>");
//
//		return new ResponseEntity<>(service.RequestClientList(), HttpStatus.OK);
//	}
	
	// http://localhost:8081/sell/insert
	// 판매_거래처 관리 - 등록 요청
	@PostMapping("/insert")
	public ResponseEntity<Integer> sell_insert(@RequestBody SellOrderDTO dto) {
		System.out.println("<<< sell_insert >>>");

		return new ResponseEntity<>(service.sellInsert(dto), HttpStatus.CREATED);
	}
	
//	// http://localhost:8081/sell/reqClientDetail/{sc_no}
//	// 판매_거래처 관리 - 1건 상세
//	@GetMapping("/reqClientDetail/{sc_no}")
//	public ResponseEntity<SellRequestClientDTO> detail_ReqClient(@PathVariable int sc_no) {
//		System.out.println("<<< detail_ReqClient >>>");
//
//		return new ResponseEntity<>(service.detailClient(sc_no), HttpStatus.OK);
//	}
//	
//	// http://localhost:8081/sell/reqClientUpdate/{sc_no}
//	// 판매_거래처 관리 - 수정
//	@PutMapping("/reqClientUpdate/{sc_no}")
//	public ResponseEntity<Integer> update_ReqClient(@PathVariable int sc_no, @RequestBody SellRequestClientDTO dto) {
//		System.out.println("<<< update_ReqClient >>>");
//
//		return new ResponseEntity<>(service.updateClient(sc_no, dto), HttpStatus.OK);
//	}
//	
//	// http://localhost:8081/sell/reqClientDel/{sc_no}
//	// 판매_거래처 관리 - 삭제
//	@DeleteMapping("/reqClientDel/{sc_no}")
//	public ResponseEntity<?> delete_ReqClient(@PathVariable int sc_no) {
//		System.out.println("<<< delete_ReqClient >>> sc_no: " + sc_no);
//		
//		return new ResponseEntity<>(service.deleteClient(sc_no), HttpStatus.OK);	// 200
//		
//	}
	
}
