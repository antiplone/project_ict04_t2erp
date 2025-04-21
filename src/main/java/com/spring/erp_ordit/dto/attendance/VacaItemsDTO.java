package com.spring.erp_ordit.dto.attendance;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@ToString			// toString
@Builder			// 매개변수 생성자에 순서없이 값을 입력해서 셋팅해도 마지막에 build()를 통해 빌더를 작동, 같은 타입의 다른 변수명의 값을 서로 바꿔넣는 것을 방지한다.
public class VacaItemsDTO {

	// 휴가항목등록 dto
	private int v_code;			// 휴가코드, PK
	private int v_list_no;		// 휴가 게시글번호(자동증가)
	private String v_name;		// 휴가명, UK
	private Date v_start;			// 휴가기간 시작일
	private Date v_end;			// 휴가기간 마지막일
	private String v_use;			// 휴가 사용여부(Y/N)
	private String v_note;		// 비고
}