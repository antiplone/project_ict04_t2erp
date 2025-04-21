package com.spring.erp_ordit.dao.attendance;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.attendance.CommuteDTO;

@Mapper
@Repository
public interface CommuteMapper {

	// 출퇴근 리스트
	public List<CommuteDTO> selectAttList();
	// 내 출퇴근 리스트
	public List<CommuteDTO> selectMyAttList(int e_id);

	// 오늘자 출퇴근 1건만 조회
	public CommuteDTO selectTodayRecord(int e_id);

	// 출근 시간 저장 처리
	public int insertStartTime(CommuteDTO dto);
	// 퇴근 시간 저장 처리
	public int updateEndTime(CommuteDTO dto);

	// 출퇴근 수정
	public int updateCommute(CommuteDTO dto);
	
}
