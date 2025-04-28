package com.spring.erp_ordit.dao.hr;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.hr.HrAppointmentDTO;

@Mapper
@Repository
public interface HrAppointmentMapper {
	
	public List<HrAppointmentDTO> hrAppointList();	// 인사발령 현황
	
	public int hrAppointInsert(HrAppointmentDTO dto);	// 인사발령 등록
	
	public int updateDepartmentOnly(HrAppointmentDTO dto); // 부서만 업데이트
	
	public int updatePositionOnly(HrAppointmentDTO dto);   // 직위만 업데이트
	
}
