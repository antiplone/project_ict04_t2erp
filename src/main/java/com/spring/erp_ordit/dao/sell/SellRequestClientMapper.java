package com.spring.erp_ordit.dao.sell;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.sell.SellRequestClientApprovalDTO;
import com.spring.erp_ordit.dto.sell.SellRequestClientDTO;

@Mapper
@Repository
public interface SellRequestClientMapper {
	
	// 판매_거래처 관리 - 요청리스트
	public List<SellRequestClientDTO> requestClientList();
	
	// 판매_거래처 관리 - 등록(거래처 정보)
	public int insertClient(SellRequestClientDTO dto);
	
	// 판매_거래처 관리 - 등록(거래처 정보)
	public int insertClientApproval(int sc_id);
	
	// 판매_거래처 관리 - 1건 상세조회
	public SellRequestClientDTO detailClient(int sc_id);
	
	// 판매_거래처 관리 - 수정
	public int updateClient(SellRequestClientDTO dto);
	
	// 판매_거래처 관리 - 삭제
	public int deleteClient(int sc_id);
	
	// 판매_거래처 관리 - 등록(거래처 정보)
	public int checkClientBizNum(String c_biz_num);
}
