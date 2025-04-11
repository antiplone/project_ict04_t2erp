package com.spring.erp_ordit.dao.sell;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.sell.SellAllListDTO;

@Mapper
@Repository
public interface SellAllListMapper {
	
	// 판매 조회 - 판매 입력한 전체 리스트
	public List<SellAllListDTO> sellAllList();
	
}