package com.spring.erp_ordit.service.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.sell.SellAllListMapper;
import com.spring.erp_ordit.dto.sell.SellAllListDTO;

@Service
public class SellAllListServiceImpl implements SellAllListService {
	
	@Autowired
	private SellAllListMapper Mapper;
	
	// 판매 조회 - 판매 입력한 전체 리스트
	@Override
	public List<SellAllListDTO> sellAllList() {
		System.out.println("서비스 - sellAllList");
		
		return Mapper.sellAllList();
	}
	
}
