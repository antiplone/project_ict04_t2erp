package com.spring.erp_ordit.dao.finance;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.finance.Voucher;

@Mapper
@Repository
public interface VoucherMapper {

	@Select("SELECT * FROM transaction_list_view")
	public List<Map<String, Object>> listTransaction();

//	@Insert("")
	void insertVoucher(Voucher voucher);
}
