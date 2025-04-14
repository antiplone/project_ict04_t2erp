package com.spring.erp_ordit.controller.basic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.basic.BasicClientDTO;
import com.spring.erp_ordit.service.basic.BasicClientServiceImpl;

@RestController
@RequestMapping("/basic")
@CrossOrigin
public class BasicClientController {
	
	@Autowired
	private BasicClientServiceImpl service;
   
   // 거래처 목록 GetMaapping -> http://localhost:8081/basic/client
	@GetMapping("/client")
	public ResponseEntity<?> findAll() {
		System.out.println("<< ClientController - clientlist >>");
		
		return new ResponseEntity<>(service.clientList(), HttpStatus.OK);
	}
	
	// 게시글 상세 GetMapping -> http://localhost:8081/basic/{client_code}
//	@GetMapping("/client/{client_code}")
//	public ResponseEntity<?> ClientDetail(@PathVariable int client_code){
//		System.out.println("<< ClientController - clientDetail >>");
//	
//		return new ResponseEntity<>(service.clientDetail(client_code), HttpStatus.OK);	// 200
//	}
	
	// 거래처 등록 PostMapping => http://localhost:8081/api/orderItem
	@PostMapping("/clientInsert")
	public ResponseEntity<?> basicInsertClient(@RequestBody BasicClientDTO item) {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => int 또는 ? 를 주면 된다. 
		System.out.println("<<< ClientController - basicInsertClient >>>");
		
		return new ResponseEntity<>(service.basicInsertClient(item), HttpStatus.CREATED); // 201 // <>를 주면 위에 있는 <int>안에 있는게 그대로 적용된다.
	}
}
