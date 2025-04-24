package com.spring.erp_ordit.controller.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.buy.BuyChatMessageDTO;
import com.spring.erp_ordit.service.buy.BuyChatMessageServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin // 프론트엔드와 백엔드가 다른 도메인(또는 포트)에서 동작할 때 발생하는 CORS 문제를 해결하기 위한 어노테이션
public class BuyChatController {   // 작성자 hjy - 1:1 채팅 컨트롤러

	@Autowired
	private BuyChatMessageServiceImpl buyChatMessageService;

	// 1:1 채팅 @MessageMapping => http://localhost:8081/buy/chat/{room_id}
	@MessageMapping("/chat/{room_id}") // 클라이언트 -> 서버 송신 경로
	@SendTo("/topic/chat/{room_id}") // 서버 -> 클라이언트 - 해당 채팅방을 구독하고 있는 사용자들에게 전송
	public BuyChatMessageDTO sendMessage(@Payload BuyChatMessageDTO chatMessage, @DestinationVariable String room_id) { 
		// @Payload 화면에서 입력받은 json 데이터 자바 객체로 변환해서 받음
		// @DestinationVariable URL의 {room_id} 값을 변수로 받음
		
		System.out.println("메시지 수신: " + chatMessage);
		
		buyChatMessageService.saveMessage(chatMessage); // 메시지 저장
		return chatMessage; // @SendTo 경로로 실시간 전송
	}
	
	// 채팅 상대 선택시 직원 목록 조회 @GetMapping => http://localhost:8081/buy/chatEmployeeList
	@GetMapping("/chatEmployeeList")
	public ResponseEntity<?> chatEmployeeList() {	
		System.out.println("<<< chatEmployeeList >>>");
		
		return new ResponseEntity<>(buyChatMessageService.getChatEmployeeList(), HttpStatus.OK); //200
	}

	// 사용자의 e_auth_id를 기준으로 room_id 생성
	@GetMapping("/chat/room")
	public String getRoomId(
		@RequestParam String my_id, 
		@RequestParam String partner_id
		) {
		return buyChatMessageService.generateRoomId(my_id, partner_id);
	}

	// 채팅 내역 조회
	@GetMapping("/chat/history/{room_id}")
	public List<BuyChatMessageDTO> getChatHistory(@PathVariable("room_id") String room_id) { // @PathVariable URL 경로에 포함된 값을 변수로 받기 위한 어노테이션
		return buyChatMessageService.getMessagesByRoom(room_id);
	}
}
