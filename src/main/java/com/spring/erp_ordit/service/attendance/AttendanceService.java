package com.spring.erp_ordit.service.attendance;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.attendance.AttMapper;
import com.spring.erp_ordit.dto.attendance.AttItemsDTO;
import com.spring.erp_ordit.dto.attendance.VacaItemsDTO;

@Service
public class AttendanceService {

	@Autowired
	private AttMapper attMapper;
	
	// 기본사항등록 - 근태 항목 리스트
	@Transactional
	public List<AttItemsDTO> regAttList() {
	    System.out.println("▶ 근태서비스 - 근태 항목 리스트");
		return attMapper.regAttList();
	}
	// 기본사항등록 - 근태 항목 등록
	@Transactional	// 서비스 함수가 종료될 때, commit 할 지 rollback 할 지 트랜잭션 관리하겠다.
	public int saveAtt(AttItemsDTO dto) {
	    System.out.println("▶ 근태서비스 - 근태 항목 등록: " + dto);
		return attMapper.insertAttItems(dto);	// myBatis I,U,D의 리턴타입이 int(1:성공, 0:실패)
	}
	// 기본사항등록 - 근태 항목 삭제
	@Transactional
	public int deleteAttItems(int a_code) {
	    System.out.println("▶ 근태서비스 - 근태 항목 삭제: " + a_code);
	    return attMapper.deleteAttItems(a_code);
	}
	// 기본사항등록 - 근태 항목 수정
	@Transactional
	public int updateAttItems(int a_code, AttItemsDTO dto) {
	    System.out.println("▶ 근태서비스 - 근태 항목 수정: " + a_code);
	    return attMapper.updateAttItems(dto);
	}

	// 기본사항등록 - 휴가 항목 등록
	@Transactional
	public List<VacaItemsDTO> regVacaList() {
	    System.out.println("▶ 근태서비스 - 휴가 항목 리스트");
		return attMapper.regVacaList();
	}
	
}
