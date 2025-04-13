package com.spring.erp_ordit.dao.personnel;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.personnel.RetirementDTO;

@Mapper
@Repository
public interface RetirementMapper {

	// 퇴사자 리스트
	public List<RetirementDTO> retirementList();
}
