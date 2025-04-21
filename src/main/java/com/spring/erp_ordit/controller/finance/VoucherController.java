package com.spring.erp_ordit.controller.finance;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(value = "/voucher")
@CrossOrigin
@RestController
public class VoucherController {

	@PostMapping(value = "/signin/{v_id}")
	public ResponseEntity<?> signin(@PathVariable(value = "v_id") int id) {
		ResponseEntity<?> entity;

		System.out.println("id: " + id);

		return null;
	}
}
