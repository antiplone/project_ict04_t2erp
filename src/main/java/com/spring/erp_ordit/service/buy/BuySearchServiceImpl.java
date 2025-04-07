package com.spring.erp_ordit.service.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuySearchMapper;
import com.spring.erp_ordit.dto.buy.BuySearchDTO;

@Service
public class BuySearchServiceImpl { // 작성자: hjy - 모달 검색 담당자,거래처 목록 
	
	@Autowired
	private BuySearchMapper BuySearchMapper;
	
	// 담당자 목록
	@Transactional(readOnly=true)
	public List<BuySearchDTO> buyInchargeList(){
		
		return BuySearchMapper.buyInchargeList();
	}

	// 거래처 목록
	@Transactional(readOnly=true)
	public List<BuySearchDTO> buyClientList(){
		
		return BuySearchMapper.buyClientList();
	}

	// 입고창고 목록
	@Transactional(readOnly=true)
	public List<BuySearchDTO> buyStorageList(){
		
		return BuySearchMapper.buyStorageList();
	}

	// 물품 목록
	@Transactional(readOnly=true)
	public List<BuySearchDTO> buyItemList(){
		
		return BuySearchMapper.buyItemList();
	}
}
