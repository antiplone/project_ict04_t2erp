package com.spring.erp_ordit.dao.hr;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.hr.HrDepartmentDTO;

@Mapper
@Repository
public interface HrDepartmentMapper {
	
	public List<HrDepartmentDTO> hrDeptList();	// 부서 목록
	
	public int hrDeptInsert(HrDepartmentDTO dto);	// 부서 등록
//
//	public int hrDeptUpdate(HrDepartmentDTO dto);	// 부서 수정
//	
//	public int hrDeptDelete(int e_id);	// 부서 삭제
	
}
