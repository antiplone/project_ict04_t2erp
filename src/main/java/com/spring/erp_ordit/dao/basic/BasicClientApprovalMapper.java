package com.spring.erp_ordit.dao.basic;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.basic.BasicClientApprovalDTO;

@Mapper
@Repository
public interface BasicClientApprovalMapper {
	
	public List<BasicClientApprovalDTO> basicClientApprovalList();	// 거래처 요청 목록
	
	public BasicClientApprovalDTO basicClientApprovalDetail(int sc_id);	// 거래처 요청 상세

	public int basicClientApprovalUpdate(BasicClientApprovalDTO dto);	// 거래처 요청 승인
	
	public int basicClientApprovalInsert(BasicClientApprovalDTO dto);	// 거래처 요청 승인
}
