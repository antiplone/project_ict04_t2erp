package com.spring.erp_ordit.controller.personnel;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.personnel.RetirementDTO;
import com.spring.erp_ordit.service.personnel.RetirementService;

@RestController
@RequestMapping("/personnel")
@CrossOrigin(origins = "*")
public class RetirementController {		// [ 인사 관리 ] - 퇴직 관리

	@Autowired
	private RetirementService service;
	
	// 퇴사자 리스트 =>   http://localhost:8081/personnel/retirementList
	@GetMapping("/retirementList")
	public ResponseEntity<List<RetirementDTO>> retirementList() {
		System.out.println("▶ RetirementController - 퇴사자 리스트");
		return new ResponseEntity<>(service.retirementList(), HttpStatus.OK);
	}
}
