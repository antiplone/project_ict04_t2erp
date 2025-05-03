package com.spring.erp_ordit.service.basic;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.basic.BasicClientApprovalMapper;
import com.spring.erp_ordit.dto.basic.BasicClientApprovalDTO;

@Service
public class BasicClientApprovalServiceImpl {

	@Autowired
	private BasicClientApprovalMapper basicMapper;
	
	// 거래처 요청 목록
	@Transactional
	public List<BasicClientApprovalDTO> basicClientApprovalList() {
		// System.out.println("<< BasicClientApprovalServiceImpl -  basicClientApprovalList >>");
		
		return basicMapper.basicClientApprovalList();
	}
	
	// 거래처 요청 상세
	@Transactional
	public BasicClientApprovalDTO basicClientApprovalDetail(int sc_id) {
		// System.out.println("<< BasicClientApprovalServiceImpl -  basicClienApprovaltDetail >>");
		
		return basicMapper.basicClientApprovalDetail(sc_id);
	}
	
	// 거래처 수정
	@Transactional
	public int basicClientApprovalUpdate(int sc_id, BasicClientApprovalDTO dto) {
		// System.out.println("<< BasicClientApprovalServiceImpl -  basicClientApprovalUpdate >>");
		
		// 진행중을 선택해도 승인 처리되는 것 방지
		if (!dto.getSa_approval_status().equals("승인") && !dto.getSa_approval_status().equals("반려")) {		// 승인도 반려도 아닐 경우 처리할 수 없음
		    throw new IllegalArgumentException("승인 또는 반려 상태만 처리할 수 있습니다.");		// 자바에서 제공하는 예외 클래스, 요청 중단됨(아래에 있는 코드는 실행되지 않음)
		}
		
		// 1. 거래처 요청 승인
	    basicMapper.basicClientApprovalUpdate(dto);

	    // 2. 요청 승인한 거래처 정보 client_tbl에 insert / 승인 상태가 '승인'일 때만 거래처 테이블로 isnert
	    if ("승인".equals(dto.getSa_approval_status())) {
	        basicMapper.basicClientApprovalInsert(dto);
	    }
	    
	    return 1; // 여러 update이므로 따로 result 안 받아도 됨
	}
	
}
