package com.spring.erp_ordit.controller.basic;

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

import com.spring.erp_ordit.dto.basic.BasicClientDTO;
import com.spring.erp_ordit.dto.hr.HrEmpCardDTO;
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
	
	// 거래처 등록 PostMapping => http://localhost:8081/basic/clientInsert
	@PostMapping("/clientInsert")
	public ResponseEntity<?> basicInsertClient(@RequestBody BasicClientDTO client) { 
		System.out.println("<<< ClientController - basicInsertClient >>>");
		
		return new ResponseEntity<>(service.basicInsertClient(client), HttpStatus.CREATED);
	}
	
	// 거래처 상세 GetMapping -> http://localhost:8081/basic/clientDetail/{client_code}
	@GetMapping("/basic_client_detail/{client_code}")
	public ResponseEntity<?> basicClientDetail(@PathVariable int client_code){
		System.out.println("<< ClientController - basicClientDetail >>");
	
		return new ResponseEntity<>(service.basicClientDetail(client_code), HttpStatus.OK);
	}
	
	// 거래처 수정 @PutMapping -> http://localhost:8081/basic/clientUpdate/{client_code}
	@PutMapping("/clientUpdate/{client_code}")
	public ResponseEntity<?> basicClientUpdate(@PathVariable int client_code, @RequestBody BasicClientDTO client) {
		System.out.println("<< ClientController - basicClientUpdate >>");
		
		return new ResponseEntity<>(service.basicClientUpdate(client_code, client), HttpStatus.OK);	// 200
	}
	
	// 거래처 삭제 @DeleteMapping -> http://localhost:8081/basic/clientDelete/{client_code}
	@DeleteMapping("/clientDelete/{client_code}")
	public ResponseEntity<?> basicClientDelete(@PathVariable int client_code) {
		System.out.println("<< ClientController - basicClientDelete >>");
		
		return new ResponseEntity<>(service.basicClientDelete(client_code), HttpStatus.OK);
	}
	
}
