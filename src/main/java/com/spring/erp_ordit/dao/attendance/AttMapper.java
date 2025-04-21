package com.spring.erp_ordit.dao.attendance;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.attendance.AttItemsDTO;
import com.spring.erp_ordit.dto.attendance.VacaItemsDTO;

@Mapper		// DAOImpl을 만들지 않고 여기서 만들겠다는 의미
@Repository
public interface AttMapper {
	
	// [ 기본사항등록 ]
	// 근태 항목 리스트
	public List<AttItemsDTO> regAttList();
	// 근태 항목 등록
	public int insertAttItems(AttItemsDTO dto);
	// 근태 항목 삭제
	public int deleteAttItems(int a_code);
	// 근태 항목 수정
	public int updateAttItems(AttItemsDTO dto);

	// [ 기본사항등록 ]
	// 휴가 항목 리스트
	public List<VacaItemsDTO> regVacaList();
	// 근태 항목 등록
	public int insertVacaItems(VacaItemsDTO dto);
	// 근태 항목 삭제
	public int deleteVacaItems(int v_code);
	// 근태 항목 수정
	public int updateVacaItems(VacaItemsDTO dto);
	// 휴가 항목 리스트: 휴가명
	public List<String> vacaName();

}
