package com.spring.erp_ordit.service.attendance;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spring.erp_ordit.dao.attendance.AttMapper;
import com.spring.erp_ordit.dto.attendance.AttItemsDTO;
import com.spring.erp_ordit.dto.attendance.VacaItemsDTO;

@Service
public class AttendanceService {

	@Autowired
	private AttMapper attMapper;
	
	// 기본사항등록 - 근태항목 리스트
	public List<AttItemsDTO> regAttList() {
//	    System.out.println("▶ attService - 근태항목 리스트");
		return attMapper.regAttList();
	}
	// 기본사항등록 - 근태항목 등록
	public int saveAtt(AttItemsDTO dto) {
//	    System.out.println("▶ attService - 근태항목 등록: " + dto);
		return attMapper.insertAttItems(dto);	// myBatis I,U,D의 리턴타입이 int(1:성공, 0:실패)
	}
	// 기본사항등록 - 근태항목 삭제
	public int deleteAttItems(int a_code) {
//	    System.out.println("▶ attService - 근태항목 삭제: " + a_code);
	    return attMapper.deleteAttItems(a_code);
	}
	// 기본사항등록 - 근태항목 수정
	public int updateAttItems(int a_code, AttItemsDTO dto) {
//	    System.out.println("▶ attService - 근태항목 수정: " + a_code);
	    return attMapper.updateAttItems(dto);
	}

	// ------------------------------------------------------------------------------------------------------------------
	// 기본사항등록 - 휴가항목 리스트
	public List<VacaItemsDTO> regVacaList() {
//	    System.out.println("▶ attService - 휴가항목 리스트");
		return attMapper.regVacaList();
	}
	// 기본사항등록 - 휴가항목 등록
	public int saveVaca(VacaItemsDTO dto) {
//	    System.out.println("▶ attService - 휴가항목 등록: " + dto);
		return attMapper.insertVacaItems(dto);	// myBatis I,U,D의 리턴타입이 int(1:성공, 0:실패)
	}
	// 기본사항등록 - 휴가항목 삭제
	public int deleteVacaItems(int v_code) {
//	    System.out.println("▶ attService - 휴가항목 삭제: " + v_code);
	    return attMapper.deleteVacaItems(v_code);
	}
	// 기본사항등록 - 휴가항목 수정
	public int updateVacaItems(int v_code, VacaItemsDTO dto) {
//	    System.out.println("▶ attService - 휴가항목 수정: " + v_code);
	    return attMapper.updateVacaItems(dto);
	}
	
	// 기본사항등록 - 휴가 항목 등록 
	public List<String> vacaName() {
//	    System.out.println("▶ attService - 휴가항목 리스트: 휴가명");
		return attMapper.vacaName();
	}
}
