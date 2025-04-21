package com.spring.erp_ordit.dto.hr;

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
public class HrDepartmentDTO {

	private String d_code;        // 부서 코드
    private String d_name;        // 부서명
    private String d_tel;         // 부서 전화번호
    private String d_address;     // 부서 주소
    private String d_manager;     // 부서장
}
