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
		
		return cardMapper.hrEmpCardList();
	}
	
//	// 게시글 등록
//	@Transactional	// 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리
//	public int basicInsertItem(BaiscItemDTO dto) {
//		int nextItemCode  = basicItemMapper.getNextItemCode();	// item_code 조회
//		dto.setItem_code(nextItemCode); 
//		return basicItemMapper.basicInsertItem(dto);	// 마이바티스 i, u, d 리턴타입 int(1: 성공, 0: 실패)
//	}
//	
//	// 게시글 상세
////	@Transactional(readOnly=true)
////	public BaiscItemDTO basicItemDetail(int item_code) {
////		return basicItemMapper.basicItemDetail(item_code);
////	}
//	
//	// 게시글 수정
//	@Transactional
//	public int basicUpdateItem(int item_code, BaiscItemDTO dto) {	// BoardDTO 리턴: 상세페이지로 리턴하기 위해
//		
//		return basicItemMapper.basicUpdateItem(dto);
//	}
//
//	// 게시글 삭제
//	@Transactional
//	public String basicDeleteItem(int item_code) {
//		basicItemMapper.basicDeleteItem(item_code);
//		return "ok";		
//	}
}
