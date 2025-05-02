package com.spring.erp_ordit.controller.hr;

import java.util.List;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.hr.HrRetirementDTO;
import com.spring.erp_ordit.service.hr.HrRetirementService;

@RestController
@RequestMapping("/hr")
@CrossOrigin(origins = "*")
public class HrRetirementController {		// [ 인사 관리 ] - 퇴직 관리

//	private static final Logger log = LoggerFactory.getLogger(HrRetirementService.class);
	
	@Autowired
	private HrRetirementService service;
	
	// 퇴직 리스트 =>   http://localhost:8081/hr/hrRetirementList
	@GetMapping("/hrRetirementList")
	public ResponseEntity<List<HrRetirementDTO>> hrRetirementList() {
//		log.info("▶ HrRetirementController - 퇴직 리스트");
		return new ResponseEntity<>(service.retirementList(), HttpStatus.OK);
	}
	
	// 퇴직 1건 조회(상세페이지) =>   http://localhost:8081/hr/hrRetirementDetail/10
	@GetMapping("/hrRetirementDetail/{e_id}")
	public ResponseEntity<?> hrRetirementDetail(@PathVariable int e_id) {
//		log.info("▶ HrRetirementController - 퇴직 1건 조회: " + e_id);
		return new ResponseEntity<>(service.retirementDetail(e_id), HttpStatus.OK);
	}
	// 퇴직 1건 수정(상세페이지) =>   http://localhost:8081/hr/hrRetirementUpdate/10
	@PutMapping("/hrRetirementUpdate/{e_id}")
	public ResponseEntity<?> updateAttItems(@PathVariable int e_id, @RequestBody HrRetirementDTO dto) {
//		log.info("▶ HrRetirementController - 퇴직 1건 수정: " + e_id);
		return new ResponseEntity<>(service.retirementUpdate(e_id, dto), HttpStatus.OK);
	}
	// 퇴직 1건 추가 =>   http://localhost:8081/hr/hrRetirementInsert
	@PostMapping("/hrRetirementInsert")
	public ResponseEntity<?> hrRetirementInsert(@RequestBody HrRetirementDTO dto) {
//		log.info("▶ HrRetirementController - 퇴직 1건 추가");
		return new ResponseEntity<>(service.retirementInsert(dto), HttpStatus.OK);
	}
	
	// 내 퇴직 리스트 =>  http://localhost:8081/hr/hrRetirementListByEid/17
	@GetMapping("/hrRetirementListByEid/{e_id}")
	public ResponseEntity<?> getRetirementListByEid(@PathVariable int e_id) {
//		log.info("▶ HrRetirementController - 내 퇴직 리스트: " + e_id);
		return new ResponseEntity<>(service.retirementListByEid(e_id), HttpStatus.OK);
	}	
}