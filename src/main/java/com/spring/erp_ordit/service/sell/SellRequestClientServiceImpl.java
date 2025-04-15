package com.spring.erp_ordit.service.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.sell.SellRequestClientMapper;
import com.spring.erp_ordit.dto.sell.SellRequestClientDTO;

@Service
public class SellRequestClientServiceImpl implements SellRequestClientService {
	
	@Autowired
	private SellRequestClientMapper requestC_Mapper;
	
	// 판매_거래처 관리 - 전체 리스트
	@Override
	@Transactional(readOnly=true)
	public List<SellRequestClientDTO> RequestClientList() {
		System.out.println("서비스 - sellRequestClientList");
		
		return requestC_Mapper.requestClientList();
	}
	
	// 판매_거래처 관리 - 등록
	@Override
	@Transactional
	public int insertClient(SellRequestClientDTO dto) {
		System.out.println("서비스 - insertCliet");
		
		return requestC_Mapper.insertClient(dto);
	}
	
	// 판매_거래처 관리 - 1건 상세조회
	@Override
	@Transactional(readOnly=true)
	public SellRequestClientDTO detailClient(int sc_id) {
		System.out.println("서비스 - detailClient");
		
		return requestC_Mapper.detailClient(sc_id);
	}
	
	// 판매_거래처 관리 - 수정
	@Transactional
    public int updateClient(int sc_id, SellRequestClientDTO dto) {	// BoardDTO 리턴: 상세페이지로 리턴하기 위해
    	
    	return requestC_Mapper.updateClient(dto);
    }
	
	// 판매_거래처 관리 - 삭제
	@Override
	@Transactional
	public String deleteClient(int sc_id) {
		System.out.println("서비스 - deleteClient=> sc_no: " + sc_id);
		requestC_Mapper.deleteClient(sc_id);
		
		return "ok";
	}

}
