package com.spring.erp_ordit.service.basic;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.basic.BasicClientMapper;
import com.spring.erp_ordit.dto.basic.BaiscItemDTO;
import com.spring.erp_ordit.dto.basic.BasicClientDTO;

@Service
public class BasicClientServiceImpl {

	@Autowired
	private BasicClientMapper basicItemMapper;
	
	// 거래처 목록
	@Transactional
	public List<BasicClientDTO> clientList() {
		
		return basicItemMapper.clientList();
	}
	
//	// 거래처 상세
//	@Transactional(readOnly=true)
//	public BasicClientDTO basicClientDetail(int client_code) {
//		return basicItemMapper.basicClientDetail(client_code);
//	}
	
	// 게시글 등록
	@Transactional	// 서비스 함수가 종료될 때 commit 할지 rollback 할지 트랜잭션 관리
	public int basicInsertClient(BasicClientDTO dto) {
		return basicItemMapper.basicInsertClient(dto);	// 마이바티스 i, u, d 리턴타입 int(1: 성공, 0: 실패)
	}
}
