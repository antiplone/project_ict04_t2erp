package com.spring.erp_ordit.service.sell;

import java.util.List;

import com.spring.erp_ordit.dto.sell.SellRequestClientDTO;


public interface SellRequestClientService {
	
	// 판매_거래처 관리 - 전체 리스트
	public List<SellRequestClientDTO> RequestClientList();
	
	// 판매_거래처 관리 - 등록
	public int insertClient(SellRequestClientDTO dto);
	
	// 판매_거래처 관리 - 1건 상세조회
	public SellRequestClientDTO detailClient(int sc_no);
	
	// 판매_거래처 관리 - 수정
	public int updateClient(int sc_no, SellRequestClientDTO dto);
	
	// 판매_거래처 관리 - 삭제
	public String deleteClient(int sc_no);
}
