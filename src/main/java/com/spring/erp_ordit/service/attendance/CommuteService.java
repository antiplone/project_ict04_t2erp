package com.spring.erp_ordit.service.attendance;

import java.sql.Date;
import java.sql.Time;			// 시간 차이 계산용
import java.time.Duration;		// 시간 차이 계산용
import java.time.LocalDate;
import java.time.LocalTime;	// 시간 계산용
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
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
	    CommuteDTO dto = new CommuteDTO();
	    System.out.println("1건 조회: "+ dto);
	    
	    return dao.selectMyAttList(e_id);
	}

	// 오늘자 출퇴근 1건만 조회
	public CommuteDTO getRecordByDate(int e_id, String date) {
		System.out.println("▶ CommuteService - 오늘자 출퇴근 1건 조회, e_id: " + e_id + ", date: " + date);
		return dao.selectTodayRecord(e_id, date);
	}

	// 근태관리 - 출근 시간 저장 처리 => 시간 변조를 방지하기 위해 서버 시간 기준으로 출근 처리하는 방식
	public String insertStartTime(CommuteDTO dto) {
	    System.out.println("▶ CommuteService - 출근 시간 저장 처리");

	    // 'Asia/Seoul' 시간대 기준으로 현재 날짜와 시간 가져오기
	    ZonedDateTime seoulNow = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
	    
	    // 서버가 어디에 있어도 항상 한국 시간으로 출근 시간이 기록
	    LocalDate today = seoulNow.toLocalDate();
	    LocalTime now = seoulNow.toLocalTime();
	    
	    // DB의 co_work_date, co_start_time 컬럼에 들어갈 값을 지정하는 부분임.
	    dto.setCo_work_date(Date.valueOf(today));		// java.sql.Date로 변환하여 DB에 저장함.
	    dto.setCo_start_time(Time.valueOf(now));		// java.sql.Time으로 변환함.
	    
	    // 지각 기준을 오전 9시로 설정 => 09:00
	    LocalTime lateLimit = LocalTime.of(9, 0);

	    // 오전 9시보다 늦으면 '지각', 아니면 '정상' => DB의 co_status, co_status_note 컬럼에 저장함.
	    if (now.isAfter(lateLimit)) {
	        dto.setCo_status("지각");
	        dto.setCo_status_note("09시 이후 출근");
	    } else {
	        dto.setCo_status("정상");
	        dto.setCo_status_note(null);
	    }
	    
	    // insert문
	    int result = dao.insertStartTime(dto);
	    return result > 0 ? "안녕하십니까" : "출근 실패했습니다. 다시 시도해주세요";
	}
	
	// 근태관리 - 퇴근 시간 저장 처리 + 자동 근무시간 계산
	public String updateEndTime(CommuteDTO dto) {
	    System.out.println("▶ CommuteService - 퇴근 시간 저장 처리");
	    
	    // 'Asia/Seoul' 시간대 기준으로 현재 날짜와 시간 가져오기
	    ZonedDateTime seoulNow = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
	    LocalDate today = seoulNow.toLocalDate();
	    LocalTime now = seoulNow.toLocalTime();
	    
	    String todayStr = today.toString(); // "2025-04-21" 이런 식
	    dto.setCo_work_date(Date.valueOf(today));
	    
	    Time endTime = Time.valueOf(now);
        dto.setCo_end_time(endTime);
	    
	    // DB에서 오늘 출근기록 가져오기
	    CommuteDTO record = dao.selectTodayRecord(dto.getE_id(), todayStr);
	    if (record == null || record.getCo_start_time() == null) {
	    	return "출근 기록이 없습니다.";
	    }
	    System.out.println("출근기록 확인: " + record);
	    
	    // 출근 시간을 가져와서 근무시간 계산
        LocalTime start = record.getCo_start_time().toLocalTime();
        LocalTime end = endTime.toLocalTime();

        // 출근시간이 미래로 잘 못 들어간 경우
        if (end.isBefore(start)) {
            return "시간 계산 오류 (종료 시간이 시작 시간보다 빠릅니다)";
        }

        Duration duration = Duration.between(start, end);
        Time totalTime = Time.valueOf(String.format("%02d:%02d:%02d",
                duration.toHours(), duration.toMinutesPart(), duration.toSecondsPart()));
        
        dto.setCo_total_work_time(totalTime);

        long totalMinutes = duration.toMinutes();

        if (start == null || end == null) {
            dto.setCo_status("결근");
        } else if (totalMinutes < 540) {		// 9시간 미만이면
            dto.setCo_status("근무시간 부족");
        } else {
            dto.setCo_status("정상");
        }


        int result = dao.updateEndTime(dto);
        System.out.println("업데이트된 행 수: " + result);
        System.out.println("▶ update 조건 확인: " + dto.getE_id() + " / " + dto.getCo_work_date());
        if (result == 0) System.out.println("⚠ update 실패! 조건에 맞는 데이터 없음!");
        
        return result > 0 ? "수고하셨습니다" : "퇴근 실패했습니다.";
	}

	// 출퇴근 수정
	public int commUpdate(int e_id, CommuteDTO dto) {
	    System.out.println("▶ CommuteService - 퇴근 시간 저장 처리");
	    return dao.updateCommute(dto);
	}
	
//	// ✅ 퇴근 안 한 사람 6시에 자동 퇴근처리
//    @Scheduled(cron = "0 0 6 * * ?") // 매일 6시
//    public void autoCloseIncompleteCommutes() {
//        System.out.println("▶ CommuteService - 퇴근 자동 처리 스케줄러 실행");
//
//        List<CommuteDTO> incompleteList = dao.noCompleteCommute();
//
//        for (CommuteDTO commute : incompleteList) {
//            LocalTime forcedEnd = LocalTime.of(6, 0); // 06:00:00
//            LocalTime start = commute.getCo_start_time().toLocalTime();
//
//            long workedSeconds = Duration.between(start, forcedEnd).getSeconds();
//            if (workedSeconds <= 0) {
//                // 출근이 6시 이후였던 경우 (예외처리)
//                workedSeconds = 0;
//            }
//
//            Time totalTime = Time.valueOf(LocalTime.ofSecondOfDay(workedSeconds));
//
//            commute.setCo_end_time(Time.valueOf(forcedEnd));
//            commute.setCo_total_work_time(totalTime);
//
//            if (workedSeconds == 0) {
//                commute.setCo_status("결근");
//            } else {
//                commute.setCo_status("비정상 퇴근");
//            }
//
//            commute.setCo_status_note("자동 퇴근 처리");
//
//            dao.autoUpdateCommute(commute);
//        }
//    }
}
