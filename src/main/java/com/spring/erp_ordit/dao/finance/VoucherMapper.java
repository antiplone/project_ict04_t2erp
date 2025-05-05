package com.spring.erp_ordit.dao.finance;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;


@Mapper
@Repository
public interface VoucherMapper {

	@Select("SELECT * FROM transaction_list_view")
	public List<Map<String, Object>> listTransaction();

	@Insert("INSERT INTO finance_voucher_tbl(v_number, v_classification, v_description, v_order_id) "
			+ "VALUES (#{voucher_no}, #{order_type}, #{item_standard}, #{order_id})")
	public int insertVoucher(Map<String, Object> voucher);

	@Select("SELECT * FROM finance_voucher_tbl WHERE v_order_id=#{id}")
	public Map<String, Object> getVoucher(int id);
}
