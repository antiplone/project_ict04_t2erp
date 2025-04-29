package com.spring.erp_ordit.service.finance;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.finance.VoucherMapper;
import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.finance.TransacOrderDTO;
import com.spring.erp_ordit.dto.finance.Voucher;
import com.spring.erp_ordit.dto.sell.SellOrderDTO;


@Service
public class VoucherService {

	@Autowired
	private VoucherMapper voucherMapper;

	@Transactional
	public List<Map<String, Object>> transactionList() {
		
		return voucherMapper.listTransaction();
	}

	@Transactional
	public Voucher createVoucher(TransacOrderDTO transac) {

		if (transac instanceof SellOrderDTO) {
			System.out.println("판매처 거래내역");
		}
		else if (transac instanceof BuyOrderDTO) {
			System.out.println("구매처 거래내역");
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

		return null;
	}
}