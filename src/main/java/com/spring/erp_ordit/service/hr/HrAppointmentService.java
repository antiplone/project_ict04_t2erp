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
		// System.out.println("<< HrAppointmentService - hrAppointList >>");
		
		return hrAppointMapper.hrAppointList();
	}
	
	// 인사발령 확정
	@Transactional
	public void hrAppointConfirm(HrAppointmentDTO dto) {
	    hrAppointMapper.hrAppointInsert(dto);
	}
}
