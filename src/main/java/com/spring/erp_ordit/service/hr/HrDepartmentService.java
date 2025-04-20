package com.spring.erp_ordit.service.hr;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.hr.HrDepartmentMapper;
import com.spring.erp_ordit.dto.hr.HrDepartmentDTO;

@Service
public class HrDepartmentService {

	@Autowired
	private HrDepartmentMapper hrDeptMapper;
	
	// 부서 목록
	@Transactional
	public List<HrDepartmentDTO> hrDeptList() {
		System.out.println("<< HrDepartmentService - hrDeptList >>");
		
		return hrDeptMapper.hrDeptList();
	}
	
	// 부서 등록
	@Transactional
	public int hrDeptInsert(HrDepartmentDTO dto) {
		System.out.println("<< HrDepartmentService - hrDeptList >>");
		
		return hrDeptMapper.hrDeptInsert(dto);	// 마이바티스 i, u, d 리턴타입 int(1: 성공, 0: 실패)
	}
	
	// 부서 수정
	@Transactional
	public int hrDeptUpdate(String d_code, HrDepartmentDTO dto) {
		System.out.println("<< HrDepartmentService - hrDeptUpdate >>");
		
		return hrDeptMapper.hrDeptUpdate(dto);
	}

	// 부서 삭제
	@Transactional
	public String hrDeptDelete(String d_code) {
		System.out.println("<< HrDepartmentService - hrDeptDelete >>");
	
		hrDeptMapper.hrDeptDelete(d_code);
		return "ok";		
	}
}
