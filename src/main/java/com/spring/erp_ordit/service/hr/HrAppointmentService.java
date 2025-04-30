package com.spring.erp_ordit.service.hr;

import java.time.LocalDate;
import java.time.ZoneId;
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
	    hrAppointMapper.hrAppointInsert(dto);

	    if (dto.getAppoint_date() != null) {
	        // Date를 LocalDate로 변환
	        LocalDate appointDate = dto.getAppoint_date().toLocalDate();

	        LocalDate today = LocalDate.now();

	        // 발령일이 오늘이거나 지났으면 업데이트
	        if (!appointDate.isAfter(today)) {
	            if (dto.getAppoint_type() != null) {
	                if (dto.getAppoint_type().contains("부서 이동")) {
	                    hrAppointMapper.updateDepartmentOnly(dto);
	                }
	                if (dto.getAppoint_type().contains("직위 변경")) {
	                    hrAppointMapper.updatePositionOnly(dto);
	                }
	            }
	        }
	    }
	}
}
