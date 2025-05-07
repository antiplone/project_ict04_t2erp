package com.spring.erp_ordit.controller.hr;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.hr.HrAppointmentDTO;
import com.spring.erp_ordit.service.hr.HrAppointmentService;

@RestController
@RequestMapping("/hrAppoint")
@CrossOrigin
public class HrAppointmentController {
	
	@Autowired
	private HrAppointmentService service;
	
	// 인사발령 현황 목록 GetMapping -> http://localhost:5173/hrAppoint/hrAppointList
		@GetMapping("/hrAppointList")
		public ResponseEntity<?> hrAppointList(){
			// System.out.println("<< HrAppointmentController - hrAppointList >>");
		
			return new ResponseEntity<>(service.hrAppointList(), HttpStatus.OK);
		}
		
	// 인사발령 확정(발령 테이블 insert + 인사카드 수정) PostMapping => http://localhost:5173/hrAppoint/hrAppointInsert
	@PostMapping("/hrAppointInsert")
	public ResponseEntity<?> hrAppointInsert(@RequestBody HrAppointmentDTO appoint) { 
		// System.out.println("<<< HrAppointmentController - hrAppointInsert >>>");
		
		service.hrAppointConfirm(appoint);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

}
