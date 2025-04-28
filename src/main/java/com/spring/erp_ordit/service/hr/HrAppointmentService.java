package com.spring.erp_ordit.service.hr;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.hr.HrAppointmentMapper;
import com.spring.erp_ordit.dto.hr.HrAppointmentDTO;

@Service
public class HrAppointmentService {

	@Autowired
	private HrAppointmentMapper hrAppointMapper;
	
	@Autowired
	// 인사발령 현황 목록
	@Transactional
	public List<HrAppointmentDTO> hrAppointList() {
		System.out.println("<< HrAppointmentService - hrAppointList >>");
		
		return hrAppointMapper.hrAppointList();
	}
	
	// 인사발령 확정
	@Transactional
	public void hrAppointConfirm(HrAppointmentDTO dto) {
	    hrAppointMapper.hrAppointInsert(dto); // 인사발령 테이블 insert
	    
	    if ("부서 이동".equals(dto.getAppoint_type())) {
	        hrAppointMapper.updateDepartmentOnly(dto);  // 부서만 수정하는 메서드
	    } else if ("직위 변경".equals(dto.getAppoint_type())) {
	        hrAppointMapper.updatePositionOnly(dto);    // 직위만 수정하는 메서드
	    }
	}
	
}
