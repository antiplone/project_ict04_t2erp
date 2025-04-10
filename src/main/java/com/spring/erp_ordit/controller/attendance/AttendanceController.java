package com.spring.erp_ordit.controller.attendance;

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

import com.spring.erp_ordit.dto.attendance.AttItemsDTO;
import com.spring.erp_ordit.dto.attendance.VacaItemsDTO;
import com.spring.erp_ordit.service.attendance.AttendanceService;

@RestController		// return 타입이 JSON이다.
@RequestMapping("/attendance")
@CrossOrigin(origins = "*") // (중요) F12 브라우저에서 CORS policy 에러났을 때, 이 어노테이션을 붙여야 안난다.
public class AttendanceController {		// [ 기본사항등록 ]
	
	@Autowired
	private AttendanceService service;

	// 근태 항목 등록 리스트 ⇒ http://localhost:8081/attendance/regAttItems
	@GetMapping("/regAttItems")
	public ResponseEntity<List<AttItemsDTO>> regAttItems() {
		System.out.println("▶ AttendanceController - 근태 항목 리스트");
		return new ResponseEntity<>(service.regAttList(), HttpStatus.OK);		// 200 리턴(select)
	}

	// 근태 항목 등록(Post) ⇒  http://localhost:8081/attendance/addAttItems
	@PostMapping("/addAttItems")
	public ResponseEntity<Integer> addAttItems(@RequestBody AttItemsDTO dto) {
		System.out.println("▶ AttendanceController - 근태 항목 등록: " + dto);		// dto가 잘 찍히는지 확인
		return new ResponseEntity<>(service.saveAtt(dto), HttpStatus.CREATED);	// 201 리턴
	}

	// 근태 항목 삭제(Delete) ⇒ http://localhost:8081/attendance/deleteAttItems/30008
	@DeleteMapping("/deleteAttItems/{a_code}")
	public ResponseEntity<?> deleteAttItems(@PathVariable int a_code){
		System.out.println("▶ AttendanceController - 근태 항목 삭제: " + a_code);
//	    return new ResponseEntity<> (service.deleteAttItems(a_code), HttpStatus.OK);  // 삭제 결과 (1: 성공, 0: 실패)
	    int result = service.deleteAttItems(a_code);
	    if (result > 0) {
	        return new ResponseEntity<>("1", HttpStatus.OK);  // 삭제 성공
	    } else {
	        return new ResponseEntity<>("0", HttpStatus.NOT_FOUND);  // 삭제 실패
	    }
	}

	// 근태 항목 수정(Put) ⇒ http://localhost:8081/attendance/updateAttItems/a_code
	@PutMapping("/updateAttItems/{a_code}")
	public ResponseEntity<Integer> updateAttItems(@PathVariable int a_code, @RequestBody AttItemsDTO dto) {
		System.out.println("▶ AttendanceController - 근태 항목 수정: " + a_code);
		return new ResponseEntity<>(service.updateAttItems(a_code, dto), HttpStatus.OK);
	}
    
	// ------------------------------------------------------------------------------------------------------------------
	// [ 기본사항등록 ] - 휴가 항목 등록 리스트 ⇒ http://localhost:8081/attendance/regVacaItems
	@GetMapping("/regVacaItems")
	public ResponseEntity<List<VacaItemsDTO>> regVacaItems() {
		System.out.println("▶ AttendanceController - 휴가 항목 리스트");
		return new ResponseEntity<>(service.regVacaList(), HttpStatus.OK);		// 200 리턴(select)
	}
}
