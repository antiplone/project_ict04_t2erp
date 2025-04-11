package com.spring.erp_ordit.dao.basic;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.basic.ClientsDTO;


@Mapper
@Repository
public interface ClientDAO {
	
	public List<ClientsDTO> clientList();	// 게시글 목록

	public ClientsDTO clientDetail(int client_code);	// 게시글 상세페이지

}
