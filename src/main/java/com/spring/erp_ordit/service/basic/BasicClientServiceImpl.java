package com.spring.erp_ordit.service.basic;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.basic.BasicClientMapper;
import com.spring.erp_ordit.dto.basic.BasicClientDTO;

@Service
public class BasicClientServiceImpl {

	@Autowired
	private BasicClientMapper basicMapper;
	
	// 거래처 목록
	@Transactional
	public List<BasicClientDTO> clientList() {
		System.out.println("<< BasicClientServiceImpl -  clientList >>");
		
		return basicMapper.clientList();
	}
	
	// 게시글 등록
	@Transactional
	public int basicInsertClient(BasicClientDTO dto) {
		System.out.println("<< BasicClientServiceImpl -  basicInsertClient >>");
		
		return basicMapper.basicInsertClient(dto);
	}
		
	// 거래처 상세
	@Transactional
	public BasicClientDTO basicClientDetail(int client_code) {
		System.out.println("<< BasicClientServiceImpl -  basicClientDetail >>");
		
		return basicMapper.basicClientDetail(client_code);
	}
	
	// 거래처 수정
	@Transactional
	public int basicClientUpdate(int client_code, BasicClientDTO dto) {
		System.out.println("<< BasicClientServiceImpl -  basicClientDetail >>");
		
		return basicMapper.basicClientUpdate(dto);
	}

	// 거래처 삭제
	@Transactional
	public String basicClientDelete(int client_code) {
		System.out.println("<< BasicClientServiceImpl -  basicClientDelete >>");
		
		basicMapper.basicClientDelete(client_code);
		return "ok";		
	}

}
