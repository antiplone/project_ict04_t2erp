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
@CrossOrigin // 추가
public class BuyChatController {

	@Autowired
	private BuyChatMessageServiceImpl buyChatMessageService;

	// 1:1 채팅 @MessageMapping => http://localhost:8081/buy/chat.sendMessage
	@MessageMapping("/chat/{room_id}") // 클라이언트 -> /buy/chat.sendMessage // 클라이언트 → 서버 송신 경로
	@SendTo("/topic/chat/{room_id}") // 구독 주소 -> /topic/public // 구독중인 클라이언트로 브로드캐스트
	public BuyChatMessageDTO sendMessage(@Payload BuyChatMessageDTO chatMessage, @DestinationVariable String room_id) {

		System.out.println("메시지 수신: " + chatMessage.getContent());

		if ("JOIN".equals(chatMessage.getType())) {
			chatMessage.setContent(chatMessage.getSender() + " 님이 입장하셨습니다");
		}
		buyChatMessageService.saveMessage(chatMessage); // DB 저장
		return chatMessage; // 실시간 전송
	}
	
	// 채팅 상대 선택시 직원 목록 조회 @GetMapping => http://localhost:8081/buy/chatEmployeeList
	@GetMapping("/chatEmployeeList")
	public ResponseEntity<?> chatEmployeeList() {	
		System.out.println("<<< chatEmployeeList >>>");
		
		return new ResponseEntity<>(buyChatMessageService.getChatEmployeeList(), HttpStatus.OK); //200
	}

	// 사용자의 e_auth_id를 기준으로 room_id 생성
	@GetMapping("/chat/room")
	public String getRoomId(@RequestParam String myId, @RequestParam String partnerId) {
		return buyChatMessageService.generateRoomId(myId, partnerId);
	}

	// 채팅 내역 조회
	@GetMapping("/chat/history/{room_id}")
	public List<BuyChatMessageDTO> getChatHistory(@PathVariable("room_id") String room_id) {
		return buyChatMessageService.getMessagesByRoom(room_id);
	}
}
