package com.spring.erp_ordit.controller.buy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.buy.BuyChatMessageDTO;
import com.spring.erp_ordit.service.buy.BuyChatMessageServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin	// 추가  
public class BuyChatController {
	
	@Autowired
	private BuyChatMessageServiceImpl buyChatMessageService;
	
	// 1:1 채팅 @MessageMapping => http://localhost:8081/buy/chat.sendMessage
	@MessageMapping("/chat.sendMessage") // 클라이언트 -> /buy/chat.sendMessage // 클라이언트 → 서버 송신 경로
    @SendTo("/topic/public")             // 구독 주소 -> /topic/public // 구독중인 클라이언트로 브로드캐스트
    public BuyChatMessageDTO sendMessage(BuyChatMessageDTO chatMessage) {
		
		System.out.println("메시지 수신: " + chatMessage.getContent());
		
		if ("JOIN".equals(chatMessage.getType())) {
	        chatMessage.setContent(chatMessage.getSender() + " 님이 입장하셨습니다");
	    }
		buyChatMessageService.saveMessage(chatMessage);  // DB 저장
	    return chatMessage;  // 실시간 전송
    }
}
