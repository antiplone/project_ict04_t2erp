package com.spring.erp_ordit.service.hr;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.hr.HrEmpCardMapper;
import com.spring.erp_ordit.dto.hr.HrEmpCardDTO;

@Service
public class HrEmpCardService {

	@Autowired
	private HrEmpCardMapper cardMapper;
	
	// 인사카드 목록
	@Transactional
	public List<HrEmpCardDTO> hrEmpCardList() {
		// System.out.println("<< HrEmpCardService - hrEmpCardList >>");
		
		return cardMapper.hrEmpCardList();
	}
	
	// 인사카드 등록
	@Transactional
	public int hrEmpCardInsert(HrEmpCardDTO dto) {
		// System.out.println("<< HrEmpCardService - hrEmpCardInsert >>");
		
		return cardMapper.hrEmpCardInsert(dto);
	}
	
	// 인사카드 상세
	@Transactional(readOnly=true)
	public HrEmpCardDTO hrEmpCardDetail(int e_id) {
		// System.out.println("<< HrEmpCardService - hrEmpCardDetail >>");
	
		return cardMapper.hrEmpCardDetail(e_id);
	}
	
	// 인사카드 수정
	@Transactional
	public int hrEmpCardUpdate(int e_id, HrEmpCardDTO dto) {	// BoardDTO 리턴: 상세페이지로 리턴하기 위해
		// System.out.println("<< HrEmpCardService - hrEmpCardUpdate >>");
	
		return cardMapper.hrEmpCardUpdate(dto);
	}

	// 인사카드 삭제
	@Transactional
	public String hrEmpCardDelete(int e_id) {
		// System.out.println("<< HrEmpCardService - hrEmpCardDelete >>");
	
		cardMapper.hrEmpCardDelete(e_id);
		return "ok";		
	}
}
