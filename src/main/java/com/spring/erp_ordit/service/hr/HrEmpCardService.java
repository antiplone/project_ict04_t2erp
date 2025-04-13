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
	
	// 거래처 목록
	@Transactional
	public List<HrEmpCardDTO> hrEmpCardList() {
		System.out.println("<< HrEmpCardService - hrEmpCardList >>");
		
		return cardMapper.hrEmpCardList();
	}
	
	// 게시글 등록
	@Transactional	// 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리
	public int hrEmpCardInsert(HrEmpCardDTO dto) {
		System.out.println("<< HrEmpCardService - hrEmpCardInsert >>");
		
		return cardMapper.hrEmpCardInsert(dto);	// 마이바티스 i, u, d 리턴타입 int(1: 성공, 0: 실패)
	}
	
	// 게시글 상세
	@Transactional(readOnly=true)
	public HrEmpCardDTO hrEmpCardDetail(int e_id) {
		System.out.println("<< HrEmpCardService - hrEmpCardDetail >>");
	
		return cardMapper.hrEmpCardDetail(e_id);
	}
	
	// 게시글 수정
	@Transactional
	public int hrEmpCardUpdate(int e_id, HrEmpCardDTO dto) {	// BoardDTO 리턴: 상세페이지로 리턴하기 위해
		System.out.println("<< HrEmpCardService - hrEmpCardUpdate >>");
	
		return cardMapper.hrEmpCardUpdate(dto);
	}

	// 게시글 삭제
	@Transactional
	public String hrEmpCardDelete(int e_id) {
		System.out.println("<< HrEmpCardService - hrEmpCardDelete >>");
	
		cardMapper.hrEmpCardDelete(e_id);
		return "ok";		
	}
}
