package com.spring.erp_ordit.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.spring.erp_ordit.dao.hr.HrAppointmentMapper;
import com.spring.erp_ordit.dto.hr.HrAppointmentDTO;

@Component	// Spring이 자동으로 실행시켜주는 컴포넌트
public class HrAppointmentScheduler {
	
	@Autowired
	private HrAppointmentMapper hrAppointMapper;
	
	// 특정 메서드를 정해진 시간에 자동 실행, cron 언제 실행할지를 표현 (초 분 시 일 월 요일 순)
    @Scheduled(cron = "* * 6 ? * MON-FRI")  // 평일 오전 6시에 실행(?는 무시, -는 범위 일과 요일을 동시에 지정할 수 없기 때문에 일은 무시)
    public void applyTodayAppointment() {
        // System.out.println("<< 스케줄러 실행: 오늘자 인사발령 자동 반영 >>");

        LocalDate today = LocalDate.now();	// 오늘 날짜를 구함
        List<HrAppointmentDTO> appointList = hrAppointMapper.hrAppointList();	// 모든 발령이력을 리스트에 저장

        for (HrAppointmentDTO dto : appointList) {
        	// System.out.println("스케줄러 DTO: " + dto.getE_id() + ", new_position=" + dto.getNew_position() + ", new_department=" + dto.getNew_department());
        	// System.out.println("d_code로 업데이트 시도 값 = " + dto.getD_code());
        	
        	if (dto.getAppoint_date().toLocalDate().isEqual(today)) {	// 발령일이 오늘이면 실행
                if (dto.getAppoint_type() != null) {	// 발령구분이 있는지 확인
                    if (dto.getAppoint_type().contains("부서 이동")) {	// 발령 구분에 "부서 이동" 포함하면 부서 update 실행
                        hrAppointMapper.updateDepartmentOnly(dto);
                    }
                    if (dto.getAppoint_type().contains("직급 변경")) {	// 발령 구분에 "직위 변경" 포함하면 직위 update 실행
                        hrAppointMapper.updatePositionOnly(dto);
                    }
                }
            }
        }
    }
}
