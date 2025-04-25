package com.spring.erp_ordit.dto.basic;

import java.sql.Date;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor		
@NoArgsConstructor		
@ToString
@Builder	
public class BasicClientApprovalDTO {
	
	// 거래처 요청 테이블 (request_client_tbl)
    private int sc_id;
    private String sc_req_d_name;        // 요청 부서명
    private String sc_client_name;       // 거래처명
    private String sc_ceo;               // 대표자명
    private String sc_biz_num;            // 사업자등록번호
    private String sc_email;             // 이메일
    private String sc_tel;               // 연락처
    private String zone_code;            // 우편번호
    private String base_address;         // 기본 주소
    private String detail_address;       // 상세 주소
    private String sc_type;              // 업태
    private String sc_industry;          // 업종
    private String sc_note;              // 비고
    private String sc_show;              // 요청 표시 상태 (기본 Y)
    private LocalDateTime sc_date;       // 요청일자

    // 거래처 승인 테이블 (request_client_approval_tbl)
    private int sa_approval_id;
    private int sa_request_id;           // 요청 ID (FK to sc_id)
    private int sa_e_id;                 // 승인자 사번 (FK to employee_tbl)
    private String sa_app_e_name;        // 승인자 이름
    private String sa_approval_status;   // 승인 상태 (진행중, 승인, 반려)
    private String sa_approval_comment;  // 승인 의견
    private LocalDateTime sa_approval_date; // 승인 일자
    
    // 거래처 테이블(client_tbl)
    private int client_code;		// 거래처 코드
    private String client_name;		// 거래처명
    private String c_ceo;			// 대표자명
    private String c_biz_num;		// 사업자 등록 번호
    private String c_tel;			// 거래처 연락처
    private String c_email;			// 거래처 이메일
    private String c_zone_code;		// 거래처 우편번호
    private String c_base_address;	// 거래처 기본주소
    private String c_detail_address;// 거래처 상세주소
    private String c_type;			// 거래처 유형
    private String c_industry;		// 거래처 업종
    private String c_status;		// 사용 상태
    private String c_note;			// 적요
    private Date c_reg_date;		// 등록일

}
