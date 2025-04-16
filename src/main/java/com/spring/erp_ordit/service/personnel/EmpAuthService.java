package com.spring.erp_ordit.service.personnel;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.personnel.EmpAuthDAO;

/**
 * 사원인증을 트랜잭션 처리를 해주는 서비스입니다.
 * 
 * @author YD.전
 * 
 * @see com.spring.erp_ordit.dao.personnel.EmpAuthDAO
 */
@Transactional(readOnly = true)
@Service
public class EmpAuthService {

	@Autowired
	private EmpAuthDAO dao;

	/**
	 * @param form react에서 받아온 사원인증정보
	 * 
	 * @return null이거나, 사원인증정보
	 */
	@Transactional(readOnly = true, propagation = Propagation.REQUIRES_NEW)
	public Map<String, Object> getTransaction(Map<String, Object> form) {

		// 사원인증정보 검색
		if (dao.searchQuery(form) < 1)
			return null;

		// 사원인증정보 가져옴
		return dao.getQuery(form);
//		return Map.ofEntries(
//			Map.entry("call", "ㅇㅇ")
//		);
	}
}
