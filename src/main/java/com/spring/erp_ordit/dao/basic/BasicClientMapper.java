package com.spring.erp_ordit.dao.basic;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.basic.BasicClientDTO;


@Mapper
@Repository
public interface BasicClientMapper {
	
	public List<BasicClientDTO> clientList();	// 거래처 목록

	public BasicClientDTO basicClientDetail(int client_code);	// 거래처 상세페이지

	public int basicInsertClient(BasicClientDTO dto);	// 거래처 등록
	
	public int basicClientUpdate(BasicClientDTO dto);	// 거래처 수정
	
	public int basicClientDelete(int client_code);		// 거래처 삭제
	
	public int basicBizNumCheck(String bizNum);			// 거래처 중복 확인
}
