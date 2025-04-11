package com.spring.erp_ordit.dao.buy;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuySearchDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuySearchMapper {		// 작성자: hjy - 모달 검색 담당자,거래처,창고,물품 Mapper
	
	// 담당자 목록
	public List<BuySearchDTO> buyInchargeList();	
	
	// 거래처 목록
	public List<BuySearchDTO> buyClientList();	
	
	// 창고 목록
	public List<BuySearchDTO> buyStorageList();	
	
	// 물품 목록
	public List<BuySearchDTO> buyItemList();	
}
