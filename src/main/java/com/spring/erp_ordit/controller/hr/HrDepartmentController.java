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

import com.spring.erp_ordit.dto.hr.HrDepartmentDTO;
import com.spring.erp_ordit.service.hr.HrDepartmentService;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/hrDept")
@CrossOrigin
public class HrDepartmentController {

	@Autowired
	private HrDepartmentService service;
	
	// 부서 목록 GetMapping -> http://localhost:5173/dept/hrDeptList
		@GetMapping("/hrDeptList")
		public ResponseEntity<?> hrDeptList(){
			// System.out.println("<< HrDepartmentController - hrDepList >>");
		
			return new ResponseEntity<>(service.hrDeptList(), HttpStatus.OK);	// 200
		}
		
	// 부서 등록 PostMapping => http://localhost:5173/dept/hrDeptInsert
	@PostMapping("/hrDeptInsert")
	public ResponseEntity<?> hrDeptInsert(@RequestBody HrDepartmentDTO dept) { 
		// System.out.println("<<< HrDepartmentController - hrDeptInsert >>>");
		
		return new ResponseEntity<>(service.hrDeptInsert(dept), HttpStatus.CREATED);
	}
	
	// 부서 수정 @PutMapping -> http://localhost:5173/dept/hrDeptUpdate/{d_code}
	@PutMapping("/hrDeptUpdate/{d_code}")
	public ResponseEntity<?> hrDeptUpdate(@PathVariable String d_code, @RequestBody HrDepartmentDTO dept) {
		// System.out.println("<< HrDepartmentController - hrDeptUpdate >>");
		
		return new ResponseEntity<>(service.hrDeptUpdate(d_code, dept), HttpStatus.OK);	// 200
	}
	
	// 부서 삭제 @DeleteMapping -> http://localhost:5173/dept/hrDeptDelete/{d_code}
	@DeleteMapping("/hrDeptDelete/{d_code}")
	public ResponseEntity<?> hrDeptDelete(@PathVariable String d_code) {
		// System.out.println("<< HrDepartmentController - hrDeptDelete >>");
		
		return new ResponseEntity<>(service.hrDeptDelete(d_code), HttpStatus.OK);
	}
}
