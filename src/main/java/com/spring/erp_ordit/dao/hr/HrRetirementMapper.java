package com.spring.erp_ordit.dao.hr;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.hr.HrRetirementDTO;

@Mapper
@Repository
public interface HrRetirementMapper {

	// 퇴직 리스트
	public List<HrRetirementDTO> retirementList();
	
	// 퇴직 상세 조회
	public HrRetirementDTO retirementDetail(int e_id);
	// 퇴직 1건 수정
	public int retirementUpdateManager(HrRetirementDTO dto);
	// 퇴직 1건 삭제
	public int retirementDeleteManager(int e_id);
	// 퇴직 1건 추가
	public int retirementInsertEmployee(HrRetirementDTO dto);
	
	// 내 퇴직 리스트
	public List<HrRetirementDTO> retirementListByEid(int e_id);
	// 퇴직 검토에서 승인처리
	public int updateEmployeeStatusToRetired(int e_id);
}