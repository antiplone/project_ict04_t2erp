package com.spring.erp_ordit.dao.personnel;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

/**
 * 사원인증을 데이터베이스와 연동합니다.
 * 
 * @author YD.전
 */
@Mapper
@Repository
public interface EmpAuthDAO {

	@Select(value = "SELECT COUNT(*) FROM employee_auth_tbl WHERE e_auth_id=#{eID} AND e_password=#{password}")
	public int searchQuery(Map<String, Object> map);

	@Select(value = "SELECT e_auth_id, e_token FROM employee_auth_tbl WHERE e_auth_id=#{eID}")
	public Map<String, Object> getQuery(Map<String, Object> map);
}
