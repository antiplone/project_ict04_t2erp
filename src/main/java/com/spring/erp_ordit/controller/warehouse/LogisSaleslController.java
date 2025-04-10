package com.spring.erp_ordit.controller.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.warehouse.LogisSalesDTO;
import com.spring.erp_ordit.service.warehouse.LogisSalesServiceImpl;

@RestController
@RequestMapping("/logissales")
@CrossOrigin
public class LogisSaleslController {
	
	@Autowired
	private LogisSalesServiceImpl salesService;
	
	// 주문 목록 GetMapping = > http://localhost:8081/api/WarehouseList
	@GetMapping("/logisSalesList") // 조회는 GetMapping
	public ResponseEntity<List<LogisSalesDTO>> logisSalesList() {
		System.out.println("<<< logisSalesList >>>");
		return new ResponseEntity<>(salesService.logisSalesList(), HttpStatus.OK);
	}

}
	
