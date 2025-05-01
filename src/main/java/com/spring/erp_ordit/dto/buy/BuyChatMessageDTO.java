package com.spring.erp_ordit.dto.buy;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data					// @Getter + @Setter 
@AllArgsConstructor		// 매개변수 생성자 
@NoArgsConstructor		// 디폴트 생성자
@ToString				// toString
@Builder				// 매개변수 생성자에 순서없이 값을 입력해서 세팅해도 마지막에 build()를 통해 빌더를 작동, 같은 타입의 다른변수의 값을 서로 바꿔 넣는 것을 방지한다.
public class BuyChatMessageDTO {    // 작성자 hjy - 채팅 메시지 DTO
	
	private Long id;       		// 테이블 id
    private String room_id;		// 채팅방 구분하기 위한 id
    private String user1_id;	// 사용자1
    private String user2_id;	// 사용자 2
    private String sender;		// 보낸 사람
    private String receiver;	// 받는 사람
    private String content;		// 메시지 내용
    private LocalDateTime created_at; // 보낸 시간
    private String type;  // 입장/퇴장/일반 등을 구분
}

