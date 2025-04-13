package com.spring.erp_ordit.dto.personnel;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@Builder			// 매개변수 생성자에 순서없이 값을 입력해서 셋팅해도 마지막에 build()를 통해 빌더를 작동, 같은 타입의 다른 변수명의 값을 서로 바꿔넣는 것을 방지한다.
public class RetirementDTO {
	
	// 인사 - 퇴직 관리 테이블
    private int resi_list_no;               // 퇴직 번호 (PK)
    private String resi_type;                  // 퇴사 유형
    private Date resi_app_date;             // 신청일
    private Date resi_date;                 // 예정일
    private String resi_approval_status;    // 승인 상태
    private String resi_reasons;            // 반려 사유
    private String resi_succession_yn;      // 인수인계 여부
    private String resi_note;               // 비고
    private int e_id;                       // 사번

    // JOIN 결과를 위한 필드 (nullable 허용) => 실제 테이블에 존재하지 않고, 조인을 통해 가져오는 필드라서 null이 들어올 수도 있다는 의미
    private String e_name;                  // 사원명
    private String e_position;             // 직위
    private String d_name;                 // 부서명
    // null을 허용하는 이유: 조인이 실패하거나 LEFT JOIN이면 null이 될 수 있기 때문.
}
