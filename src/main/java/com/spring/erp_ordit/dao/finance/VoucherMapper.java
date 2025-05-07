package com.spring.erp_ordit.dao.finance;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;


@Mapper
@Repository
public interface VoucherMapper {

	@Select("SELECT * FROM transaction_list_view")
	public List<Map<String, Object>> listTransaction();

	@Insert("INSERT INTO finance_voucher_tbl(v_number, v_classification, v_order_id, v_assigner, v_assign_date) "
			+ "VALUES (#{voucher_no}, #{order_type}, #{order_id}, #{assigner}, #{assign_date})")
	public int insertVoucher(Map<String, Object> voucher);

	@Update("UPDATE order_status_tbl SET order_status='승인' WHERE order_id=#{orderID}")
	public int assignStatus(int orderID);

	@Select("SELECT * FROM finance_voucher_tbl WHERE v_order_id=#{id}")
	public Map<String, Object> getVoucher(int id);
}
