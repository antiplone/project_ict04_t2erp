package com.spring.erp_ordit.service.basic;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.basic.ClientDAO;
import com.spring.erp_ordit.dto.basic.ClientsDTO;

@Service
public class ClientServiceImpl {

	@Autowired
	private ClientDAO clientDAO;
	
	// 거래처 목록
	@Transactional
	public List<ClientsDTO> clientList() {
		
		return clientDAO.clientList();
	}
	
	// 게시글 상세
	@Transactional(readOnly=true)
	public ClientsDTO clientDetail(int client_code) {
		return clientDAO.clientDetail(client_code);
	}
}
