package com.spring.erp_ordit.dao.hr;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.hr.HrEmpCardDTO;

@Mapper
@Repository
public interface HrEmpCardMapper {
	
	public List<HrEmpCardDTO> hrEmpCardList();	// 인사카드 목록
	
	public int hrEmpCardInsert(HrEmpCardDTO dto);	// 인사카드 등록

	public int hrEmpCardUpdate(HrEmpCardDTO dto);	// 인사카드 수정
	
	public int hrEmpCardDelete(int e_id);	// 인사카드 삭제
	
	public HrEmpCardDTO hrEmpCardDetail(int e_id);	// 인사카드 상세페이지
	
}
