package com.spring.erp_ordit.dto.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data				// getter/setter
@AllArgsConstructor	// 매개변수 생성자
@NoArgsConstructor	// 디폴트 생성자
@ToString
@Builder
public class CalendarDTO {			// calendar_event_tbl
	private Integer calEventId;			// 일정 고유 ID
    private String calTitle;					// 일정 제목
    private String calStartDate;		// 시작 날짜 및 시간
	private String calEndDate;		// 종료 날짜 및 시간
    private String calAllDay;				// 하루종일 표시하는 지 여부
    private String calDescription;		// 일정 상세 설명
	private String calLocation;			// 장소
    private String calEventType;		// 일정 유형
    private String isHoliday;			// 공휴일인지 체크
    private Integer eId;						// 사번
	private String calCreatedAt;		// 등록일시(=현재시간)
    private String calUpdatedAt;	// 수정일시
}
/**
 * - int 가 아닌 Integer 로 쓴 이유: front-end에서 e_id 안 보냈을 때, int 는 0으로 Integer 는 null 로 반환한다.
 * 즉, null 상태로 값을 제대로 체크하려고 Integer 로 설정함
 *
 * 복잡한 날짜 계산이나 기간 계산이 없으니까 LocalDateTime 말고 String 을 사용함.
 * 나중에 String 말고 DateTime 으로 사용한다면,
 * ↓
 * @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
 * private LocalDateTime calStartDate;
 * 이런식으로 작성하면 된다.
 */