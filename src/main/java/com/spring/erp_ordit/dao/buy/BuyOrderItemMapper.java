package com.spring.erp_ordit.dao.buy;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyOrderItemMapper {	// 작성자 - hjy 구매 물품정보 Mapper
	
	// 구매 입력 - <물품정보 입력>
	public int buyOrderItemInsert(BuyOrderItemDTO item); 
	
}
