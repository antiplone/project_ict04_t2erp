package com.spring.erp_ordit.service.hr;

import java.util.List;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.hr.HrRetirementMapper;
import com.spring.erp_ordit.dto.hr.HrEmpCardDTO;
import com.spring.erp_ordit.dto.hr.HrRetirementDTO;

@Service
public class HrRetirementService {

//	private static final Logger log = LoggerFactory.getLogger(CommuteService.class);
	
	@Autowired
	private HrRetirementMapper dao;
	@Autowired
	private HrEmpCardService empService;
	
	// 퇴직 리스트
	public List<HrRetirementDTO> retirementList() {
//		log.info("▶ HrRetirementService - 퇴직 리스트");
		return dao.retirementList();
	}
	
	// 퇴직 1건 조회
	public HrRetirementDTO retirementDetail(int e_id) {
//		log.info("▶ HrRetirementService - 퇴직 상세 조회");
		return dao.retirementDetail(e_id);
	}
	// 퇴직 1건 수정
	public int retirementUpdate(int e_id, HrRetirementDTO dto) {
//		log.info("▶ HrRetirementService - 퇴직 1건 수정");
		
	    // 퇴직 검토에서 승인 처리일 경우 -> 사원의 상태 변경(재직 -> 퇴직)
	    if ("승인".equals(dto.getRe_approval_status())) {
	        dao.updateEmployeeStatusToRetired(dto.getE_id());
	    }
	    
		return dao.retirementUpdateManager(dto);
	}
	// 퇴직 1건 추가
	public int retirementInsert(HrRetirementDTO dto) {
//		log.info("▶ HrRetirementService - 퇴직 1건 추가: " + dto);
		
		// 0번 사번은 유효하지 않은 입력으로 처리
		if (dto.getE_id() == 0) {
			throw new IllegalArgumentException("사번 0은 유효하지 않습니다.");
		}

		// DB에 사번이 존재하는지 확인
		HrEmpCardDTO emp = empService.hrEmpCardDetail(dto.getE_id());
		if (emp == null) {
			throw new IllegalArgumentException("해당 사번의 사원이 존재하지 않습니다.");
		}

		// DTO에 사원 정보 세팅
		dto.setE_name(emp.getE_name());
		dto.setE_position(emp.getE_position());
		dto.setD_name(emp.getD_name());
		
		return dao.retirementInsertEmployee(dto);
	}
	
	// 내 퇴직 리스트
	public List<HrRetirementDTO> retirementListByEid(int e_id) {
//		log.info("▶ HrRetirementService - 내 퇴직 리스트");
		return dao.retirementListByEid(e_id);
	}
}
