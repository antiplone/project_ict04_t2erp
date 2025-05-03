package com.spring.erp_ordit.service.finance;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.finance.VoucherMapper;
//import com.spring.erp_ordit.dto.finance.Voucher;


@Service
public class VoucherService {

	@Autowired
	private VoucherMapper voucherMapper;

	@Transactional(readOnly = true)
	public List<Map<String, Object>> transactionList() {
		
		return voucherMapper.listTransaction();
	}

	@SuppressWarnings(value = "unchecked")
	@Transactional
	public List<Map<String, Object>> createVoucher(Object transaction) {

		Map<String, Object> entity;
		if (transaction instanceof List) {

			System.out.println("여러건");
			List<Map<String, Object>> vouchers = (List<Map<String, Object>>)transaction;
			for (Object vou : vouchers) {

				entity = (Map<String, Object>)vou;
				entity.forEach((k, v) -> {
					System.out.println(k + " : " + v);
				});

				voucherMapper.insertVoucher(entity);
			}
		}
		else if (transaction instanceof Map) {

			System.out.println("단건");

			entity = (Map<String, Object>)transaction;
			voucherMapper.insertVoucher(entity);

			System.out.println(entity);
		}

		// Voucher 저장
//		Voucher voucher = new Voucher();
//		voucher.setV_id(request.getV_id());
//		voucher.setV_number(request.getV_number());
//		voucher.setV_classification(request.getV_classification());
//		voucher.setV_amount(request.getV_amount());
//		voucher.setV_customer(request.getV_customer());
//		voucher.setV_description(request.getV_description());
//		voucherMapper.insertVoucher(voucher);

		return voucherMapper.listTransaction();
	}

	public Map<String, Object> get(int id) {
		Map<String, Object> entity;

		entity = voucherMapper.getVoucher(id);

		return entity;
	}
}