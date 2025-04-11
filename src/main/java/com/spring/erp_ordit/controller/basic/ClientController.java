package com.spring.erp_ordit.controller.basic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.service.basic.ClientServiceImpl;

@RestController
@RequestMapping("/basic")
@CrossOrigin
public class ClientController {
	
	@Autowired
	private ClientServiceImpl service;
   
   // 게시판 목록 GetMaapping -> http://localhost:8081/main/basic_buyer/client
	@GetMapping("/client")
	public ResponseEntity<?> findAll() {
		System.out.println("<< ClientController - clientlist >>");
		
		return new ResponseEntity<>(service.clientList(), HttpStatus.OK);
	}
	
	// 게시글 상세 GetMapping -> http://localhost:8081/erp/client/{client_code}
	@GetMapping("/client/{client_code}")
	public ResponseEntity<?> ClientDetail(@PathVariable int client_code){
		System.out.println("<< ClientController - clientDetail >>");
	
		return new ResponseEntity<>(service.clientDetail(client_code), HttpStatus.OK);	// 200
	}
}
