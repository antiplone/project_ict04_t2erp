package com.spring.erp_ordit.dao.personnel;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface EmpAuthDAO {

	/**
	 * @param map 검색할 사원인증정보
	 * 
	 * @return 처리된 여부
	 */
	@Select(value = "SELECT COUNT(*) FROM employee_auth_tbl WHERE e_auth_id=#{eID} AND e_password=#{password}")
	public int searchQuery(Map<String, Object> map);

	/**
	 * @param map 가져올 사원인증정보
	 * 
	 * @return 사원인증정보
	 */
	@Select(value = "SELECT e_id, e_auth_id, e_token FROM employee_auth_tbl WHERE e_auth_id=#{eID}")
	public Map<String, Object> getQuery(Map<String, Object> map);
}
