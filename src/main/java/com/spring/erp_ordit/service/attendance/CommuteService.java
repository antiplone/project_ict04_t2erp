package com.spring.erp_ordit.service.attendance;

import java.sql.Date;
import java.sql.Time;			// 시간 차이 계산용
import java.time.Duration;		// 시간 차이 계산용
import java.time.LocalDate;
import java.time.LocalTime;	// 시간 계산용
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.attendance.CommuteMapper;
import com.spring.erp_ordit.dto.attendance.CommuteDTO;

@Service
public class CommuteService {

	@Autowired
	private CommuteMapper dao;
	
	// 전체 근태 리스트
	public List<CommuteDTO> attendanceList() {
	    System.out.println("▶ CommuteService - 출퇴근 리스트");
	    return dao.selectAttList();
	}
	// 내 근태 리스트
	public List<CommuteDTO> myAttendanceList(int e_id) {
	    System.out.println("▶ CommuteService - 내 출퇴근 리스트");
	    return dao.selectMyAttList(e_id);
	}

	// 오늘자 출퇴근 1건만 조회
	public CommuteDTO getTodayRecordByEmp(int e_id) {
		System.out.println("▶ CommuteService - 오늘자 출퇴근 1건 조회");
		return dao.selectTodayRecord(e_id);
	}

	// 근태관리 - 출근 시간 저장 처리
	public String insertStartTime(CommuteDTO dto) {
	    System.out.println("▶ CommuteService - 출근 시간 저장 처리");
	    
	    // 현재 날짜와 시간
	    LocalDate today = LocalDate.now();
	    LocalTime now = LocalTime.now();
	    
	    // 현재 날짜, 시간 설정
	    dto.setCo_work_date(Date.valueOf(today));
	    dto.setCo_start_time(Time.valueOf(now));
	    
	    // ✅ 지각 기준 시간 설정 (오전 9시)
	    LocalTime lateLimit = LocalTime.of(9, 0);

	    if (now.isAfter(lateLimit)) {
	        dto.setCo_status("지각");
	        dto.setCo_status_note("09시 이후 출근");
	    } else {
	        dto.setCo_status("정상");
	        dto.setCo_status_note(null);
	    }
	    
	    // insert문
	    int result = dao.insertStartTime(dto);
	    return result > 0 ? "출근s" : "출근 실패s";
	}
	
	// 근태관리 - 퇴근 시간 저장 처리 + 자동 근무시간 계산
	public String updateEndTime(CommuteDTO dto) {
	    System.out.println("▶ CommuteService - 퇴근 시간 저장 처리");
	    dto.setCo_work_date(Date.valueOf(LocalDate.now())); // 필수!
	    
        Time endTime = Time.valueOf(LocalTime.now());
        dto.setCo_end_time(endTime);
	    
	    // DB에서 오늘 출근기록 가져오기
	    CommuteDTO record = dao.selectTodayRecord(dto.getE_id());
	    if (record == null || record.getCo_start_time() == null) {
	    	return "출근 기록이 없습니다.";
	    }
	    System.out.println("출근기록 확인: " + record);
	    
	    // 출근 시간을 가져와서 근무시간 계산
        LocalTime start = record.getCo_start_time().toLocalTime();
        LocalTime end = endTime.toLocalTime();

        Duration duration = Duration.between(start, end);
        Time totalTime = Time.valueOf(String.format("%02d:%02d:%02d",
                duration.toHours(), duration.toMinutesPart(), duration.toSecondsPart()));
        
        // 출근시간이 미래로 잘 못 들어간 경우
        if (end.isBefore(start)) {
            return "시간 계산 오류 (종료 시간이 시작 시간보다 빠릅니다)";
        }

        dto.setCo_total_work_time(totalTime);

        long totalMinutes = duration.toMinutes();

        if (start == null || end == null) {
            dto.setCo_status("결근");
        } else if (totalMinutes < 30) {
            dto.setCo_status("근무시간 부족");
        } else {
            dto.setCo_status("정상");
        }


        int result = dao.updateEndTime(dto);
        System.out.println("업데이트된 행 수: " + result);
        System.out.println("▶ update 조건 확인: " + dto.getE_id() + " / " + dto.getCo_work_date());
        if (result == 0) System.out.println("⚠ update 실패! 조건에 맞는 데이터 없음!");
        
        return result > 0 ? "퇴근s" : "퇴근 실패s";
	}

	// 출퇴근 수정
	public int commUpdate(int e_id, CommuteDTO dto) {
	    System.out.println("▶ CommuteService - 퇴근 시간 저장 처리");
	    return dao.updateCommute(dto);
	}
}
