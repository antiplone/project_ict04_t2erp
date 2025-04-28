package com.spring.erp_ordit.controller.basic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.basic.BasicClientApprovalDTO;
import com.spring.erp_ordit.service.basic.BasicClientApprovalServiceImpl;

@RestController
@RequestMapping("/basic")
@CrossOrigin
public class BasicClientApprovalController {
	
	@Autowired
	private BasicClientApprovalServiceImpl service;
   
    // 거래처 요청 목록 GetMaapping -> http://localhost:8081/basic/clientApproval
	@GetMapping("/clientApproval")
	public ResponseEntity<?> basicClientApprovalList() {
		System.out.println("<< BasicClientApprovalController - clientlist >>");
		
		return new ResponseEntity<>(service.basicClientApprovalList(), HttpStatus.OK);
	}
	
	// 거래처 요청 상세 GetMapping -> http://localhost:8081/basic/clientApprovalDetail
	@GetMapping("/clientApprovalDetail/{sc_id}")
	public ResponseEntity<?> basicClientApprovalDetail(@PathVariable int sc_id){
		System.out.println("<< BasicClientApprovalController - basicClientApprovalDetail >>");
	
		return new ResponseEntity<>(service.basicClientApprovalDetail(sc_id), HttpStatus.OK);	// 200
	}
	
	// 거래처 수정 @PutMapping -> http://localhost:8081/basic/clientApprovalUpdate/{sc_id}
	@PutMapping("/clientApprovalUpdate/{sc_id}")
	public ResponseEntity<?> basicClientApprovalUpdate(@PathVariable int sc_id, @RequestBody BasicClientApprovalDTO sc) {
		System.out.println("<< BasicClientApprovalController - basicClientApprovalUpdate >>");
		
		sc.setSc_id(sc_id);
	    
		return new ResponseEntity<>(service.basicClientApprovalUpdate(sc_id, sc), HttpStatus.OK);	// 200
	}

}
