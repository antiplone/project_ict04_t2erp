package com.spring.erp_ordit.dto.hr;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@Builder			// 매개변수 생성자에 순서없이 값을 입력해서 셋팅해도 마지막에 build()를 통해 빌더를 작동, 같은 타입의 다른 변수명의 값을 서로 바꿔넣는 것을 방지한다.
public class HrRetirementDTO {
	
	// 인사 - 퇴직관리 테이블
    private int re_list_no;               // 퇴직 번호 (PK)
    private String re_type;                  // 퇴사 유형
    private Date re_app_date;             // 신청일
    private Date re_date;                 // 예정일
    private Date re_last_working_date;	// 마지막 근무일
    private Date re_approval_date;		// 언제 결재처리가 되었는지 기록용(추적용)
    private String re_approval_status;    // 승인 상태(진행중/승인/반려)
    private String re_apply_status;		// 퇴직 신청 상태(신청/취소/삭제)
//    private Date re_cancel_date;			// 신청 취소일
//    private String re_cancel_reason;		// 신청 철회 사유
    private String re_reject_reason;            // 반려 사유
    private String re_request_reason;			// 퇴직 신청 사유(사원용)
    private String re_succession_yn;      // 인수인계 여부
    private String re_note;               // 결재 사유(관리자용)
    private int e_id;                       // 사번

    // JOIN 결과를 위한 필드 (nullable 허용) => 실제 테이블에 존재하지 않고, 조인을 통해 가져오는 필드라서 null 이 들어올 수도 있다는 의미
    private String e_name;                  // 사원명
    private String e_position;             // 직위
    private String d_name;                 // 부서명
    // null 을 허용하는 이유: 조인이 실패하거나 LEFT JOIN이면 null 이 될 수 있기 때문.
}
