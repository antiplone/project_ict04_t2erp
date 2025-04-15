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

import com.spring.erp_ordit.dto.sell.SellRequestClientDTO;
import com.spring.erp_ordit.service.sell.SellRequestClientServiceImpl;

@RestController
@RequestMapping("/sell")
@CrossOrigin
public class SellRequestClientController {
	
	@Autowired
	private SellRequestClientServiceImpl service;
	
	// http://localhost:8081/sell/reqClientList
	// 판매_거래처 관리 - 요청리스트
	@GetMapping("/reqClientList")
	public ResponseEntity<List<SellRequestClientDTO>> list() {
		System.out.println("<<< reqClientList >>>");

		return new ResponseEntity<>(service.RequestClientList(), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/reqClientInsert
	// 판매_거래처 관리 - 등록 요청
	@PostMapping("/reqClientInsert")
	public ResponseEntity<Integer> insert(@RequestBody SellRequestClientDTO dto) {
		System.out.println("<<< reqClientinsert >>>");

		return new ResponseEntity<>(service.insertClient(dto), HttpStatus.CREATED);
	}
	
	// http://localhost:8081/sell/reqClientDetail/{sc_id}
	// 판매_거래처 관리 - 1건 상세
	@GetMapping("/reqClientDetail/{sc_id}")
	public ResponseEntity<SellRequestClientDTO> detail_ReqClient(@PathVariable int sc_id) {
		System.out.println("<<< detail_ReqClient >>>");
		
		return new ResponseEntity<>(service.detailClient(sc_id), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/reqClientUpdate/{sc_id}
	// 판매_거래처 관리 - 수정
	@PutMapping("/reqClientUpdate/{sc_id}")
	public ResponseEntity<Integer> update_ReqClient(@PathVariable int sc_id, @RequestBody SellRequestClientDTO dto) {
		System.out.println("<<< update_ReqClient >>>");

		return new ResponseEntity<>(service.updateClient(sc_id, dto), HttpStatus.OK);
	}
	
	// http://localhost:8081/sell/reqClientDel/{sc_no}
	// 판매_거래처 관리 - 삭제
	@DeleteMapping("/reqClientDel/{sc_id}")
	public ResponseEntity<?> delete_ReqClient(@PathVariable int sc_id) {
		System.out.println("<<< delete_ReqClient >>> sc_no: " + sc_id);
		
		return new ResponseEntity<>(service.deleteClient(sc_id), HttpStatus.OK);	// 200
		
	}
	
}
