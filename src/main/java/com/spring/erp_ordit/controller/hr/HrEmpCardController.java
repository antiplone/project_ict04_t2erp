package com.spring.erp_ordit.controller.hr;

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

import com.spring.erp_ordit.dto.hr.HrEmpCardDTO;
import com.spring.erp_ordit.service.hr.HrEmpCardService;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/hrCard")
@CrossOrigin	// 추가  
public class HrEmpCardController {

	@Autowired
	private HrEmpCardService service;
	
	// 인사카드 목록 GetMapping -> http://localhost:8081/hrCard/hrCardList
		@GetMapping("/hrCardList")
		public ResponseEntity<?> hrEmpCardList(){
			System.out.println("<< HrController - hrEmployeeCardList >>");
		
			return new ResponseEntity<>(service.hrEmpCardList(), HttpStatus.OK);	// 200
		}
		
	// 인사카드 등록 PostMapping => http://localhost:8081/hrCard/hrCardInsert
	@PostMapping("/hrCardInsert")
	public ResponseEntity<?> hrEmpCardInsert(@RequestBody HrEmpCardDTO empCard) {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => int 또는 ? 를 주면 된다. 
		System.out.println("<<< HrController- hrEmpCardInsert >>>");
		
		return new ResponseEntity<>(service.hrEmpCardInsert(empCard), HttpStatus.CREATED); // 201 // <>를 주면 위에 있는 <int>안에 있는게 그대로 적용된다.
	}
	
	// 인사카드 상세 GetMapping -> http://localhost:8081/hrCard/hrCardLDetail/{e_id}
	@GetMapping("/hrCardDetail/{e_id}")
	public ResponseEntity<?> hrEmpCardDetail(@PathVariable int e_id){
		System.out.println("<< HrController - basicItemDetail >>");
	
		return new ResponseEntity<>(service.hrEmpCardDetail(e_id), HttpStatus.OK);	// 200
	}
	
	// 인사카드 수정 @PutMapping -> http://localhost:8081/hrCard/hrCardUpdate/{e_id}
	@PutMapping("/hrCardUpdate/{e_id}")
	public ResponseEntity<?> hrEmpCardUpdate(@PathVariable int e_id, @RequestBody HrEmpCardDTO empCard) {
		System.out.println("<< HrController - hrEmpCardUpdate >>");
		
		return new ResponseEntity<>(service.hrEmpCardUpdate(e_id, empCard), HttpStatus.OK);	// 200
	}
	
	// 인사카드 삭제 @DeleteMapping -> http://localhost:8081/hrCard/hrCardDelete/{e_id}
	@DeleteMapping("/hrCardDelete/{e_id}")
	public ResponseEntity<?> hrEmpCardDelete(@PathVariable int e_id) {
		System.out.println("<< HrController - hrEmpCardDelete >>");
		
		return new ResponseEntity<>(service.hrEmpCardDelete(e_id), HttpStatus.OK);
	}

}
