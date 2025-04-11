package com.spring.erp_ordit.service.sell;

import java.util.List;

import com.spring.erp_ordit.dto.sell.SellOrderDTO;



public interface SellService {	// 판매 입력, 조회, 수정, 삭제
	
	// 판매 조회, 현황 페이지 - 전체 리스트
//	public List<SellRequestClientDTO> requestClientList();
	
	// 판매 입력 - 등록
	public int sellInsert(SellOrderDTO dto);
	
	// 판매 입력 - 1건 상세조회
//	public sellRequestClientDTO detailClient(int sc_no);
//	
//	// 판매 입력 - 수정
//	public int updateClient(int sc_no, SellRequestClientDTO dto);
//	
//	// 판매 입력 - 삭제
//	public String deleteClient(int sc_no);
}
