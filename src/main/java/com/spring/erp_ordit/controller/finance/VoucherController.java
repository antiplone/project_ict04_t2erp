package com.spring.erp_ordit.controller.finance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.service.finance.VoucherService;

@RequestMapping(value = "/voucher")
@CrossOrigin
@RestController
public class VoucherController {

	@Autowired
	private VoucherService service;

	@GetMapping(value = "/transactions")
	public ResponseEntity<?> transactionList() {
		ResponseEntity<?> entity;

		entity = ResponseEntity.ok(service.transactionList());

		return entity;
	}

	@PostMapping(value = "/signin")
	public ResponseEntity<?> signin(@RequestBody Object transaction) {

		ResponseEntity<?> entity = ResponseEntity
									.ok(service.createVoucher(transaction));

		return entity;
	}
}
