package com.spring.erp_ordit.service.personnel;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.personnel.RetirementMapper;
import com.spring.erp_ordit.dto.personnel.RetirementDTO;

@Service
public class RetirementService {

	@Autowired
	private RetirementMapper dao;
	
	// 퇴사자 리스트
	public List<RetirementDTO> retirementList() {
		System.out.println("▶ RetirementService - 퇴사자 리스트");
		return dao.retirementList();
	}
}
