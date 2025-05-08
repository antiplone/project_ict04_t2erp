package com.spring.erp_ordit.scheduler;

import java.sql.Date;
import java.sql.Time;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.spring.erp_ordit.dao.attendance.CommuteMapper;
import com.spring.erp_ordit.dto.attendance.CommuteDTO;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CommuteScheduler {

    private final CommuteMapper dao;

    // 매일 오전 6시에 전날 퇴근 누락자 자동 퇴근 처리
    @Scheduled(cron = "0 0 6 * * *")	// 초   분  시  일  월  요일
    public void autoCheckOutIfMissing() {
        System.out.println("⏰ [스케줄러 실행] 전날 퇴근 누락자 처리 시작");
        
        LocalDate yesterday = LocalDate.now().minusDays(1);	// 어제 날짜
        Date sqlYesterday = Date.valueOf(yesterday);

        // 출근했지만 퇴근을 안 한 사원 목록 조회
        List<CommuteDTO> missingList = dao.selectMissingCheckouts(sqlYesterday);

        for (CommuteDTO dto : missingList) {
            dto.setCo_end_time(Time.valueOf(LocalTime.of(18, 0))); // 퇴근시간: 18:00
            dto.setCo_status_note("퇴근 미체크 자동처리");

            // 근무 시간 계산
            LocalTime start = dto.getCo_start_time().toLocalTime();
            LocalTime end = dto.getCo_end_time().toLocalTime();
            Duration workDuration = Duration.between(start, end);

            long seconds = workDuration.getSeconds();
            long hours = seconds / 3600;
            long minutes = (seconds % 3600) / 60;
            long secs = seconds % 60;

            Time totalWorkTime = Time.valueOf(String.format("%02d:%02d:%02d", hours, minutes, secs));
            dto.setCo_total_work_time(totalWorkTime);
            
            // 퇴근시간 + 상태비고 업데이트
            dao.updateEndTime(dto);
        }
        System.out.println("✅ [" + yesterday + "] 퇴근 누락 자동 처리 완료 (" + missingList.size() + "건)");
    }
}
