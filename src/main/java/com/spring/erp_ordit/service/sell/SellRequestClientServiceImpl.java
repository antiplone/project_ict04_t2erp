package com.spring.erp_ordit.service.sell;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.sell.SellRequestClientMapper;
import com.spring.erp_ordit.dto.sell.SellOrderItemDTO;
import com.spring.erp_ordit.dto.sell.SellRequestClientApprovalDTO;
import com.spring.erp_ordit.dto.sell.SellRequestClientDTO;

@Service
public class SellRequestClientServiceImpl implements SellRequestClientService {
	
	@Autowired
	private SellRequestClientMapper mapper;
	
	// 판매_거래처 관리 - 전체 리스트
	@Override
	@Transactional(readOnly=true)
	public List<SellRequestClientDTO> RequestClientList() {
		System.out.println("서비스 - sellRequestClientList");
		
		return mapper.requestClientList();
	}
	
	// 판매_거래처 관리 - 등록
	@Override
	@Transactional
	public int insertClient(SellRequestClientDTO dto) {
		System.out.println("서비스 - insertCliet");
		
		// 1. request_client_tbl에 insert
		int insertResult = mapper.insertClient(dto);
		System.out.println("서비스 - insertResult: " + insertResult);
		
		// insert 실패 시 바로 false 리턴
		if (insertResult == 0) {
			return 0;
		}
		else {
			// 2. request_client_tbl에 입력된 sc_id 값 가져오기
			int sc_id = dto.getSc_id();
			System.out.println("서비스 - sc_id : " + sc_id);

			// 3. request_client_tbl의 sa_request_id에 값 넣기
			int approvalResult = mapper.insertClientApproval(sc_id);
					
			if (approvalResult == 0) {
				return 0;
			}
			else {
				return approvalResult;
			}
		}
	}
	
	// 판매_거래처 관리 - 1건 상세조회
	@Override
	@Transactional(readOnly=true)
	public SellRequestClientDTO detailClient(int sc_id) {
		System.out.println("서비스 - detailClient");
		
		return mapper.detailClient(sc_id);
	}
	
	// 판매_거래처 관리 - 수정
	@Override
	@Transactional
    public int updateClient(int sc_id, SellRequestClientDTO dto) {	// BoardDTO 리턴: 상세페이지로 리턴하기 위해
		System.out.println("서비스 - SellRequestClientDTO");
		System.out.println("서비스 - sc_id => " + sc_id);
		
		dto.setSc_id(sc_id);
		System.out.println("서비스 - dto => " + dto);
		
    	return mapper.updateClient(dto);
    }
	
	// 판매_거래처 관리 - 삭제
	@Override
	@Transactional
	public String deleteClient(int sc_id) {
		System.out.println("서비스 - deleteClient=> sc_no: " + sc_id);
		mapper.deleteClient(sc_id);
		
		return "ok";
	}
	
	// 판매_거래처 관리 - 사업자등록번호 중복체크
	@Override
	@Transactional
	public int sellCheckReqClientBizNum(String sc_biz_num) {
		System.out.println("서비스 - sellCheckReqClientBizNum");

	    return mapper.checkClientBizNum(sc_biz_num);
	}
}
