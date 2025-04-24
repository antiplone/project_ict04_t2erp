package com.spring.erp_ordit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration // 설정 클래스 => 자동이아닌 수동, 내가 지정한대로 구성하겠다는 뜻
@EnableWebSocketMessageBroker //STOMP 기반 WebSocket 메시지 브로커를 활성화 하기 위해 쓴 어노테이션
// WebSocketMessageBrokerConfigurer =>  WebSocket 설정을 커스터마이징할 수 있게 해주는 인터페이스
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {  // 작성자 hjy - 1:1 채팅 WebSocketConfig 
    
	// 메시지 브로커 구성
	@Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // 메시지 받을 경로 (서버 -> 클라이언트로 응답) => BuyChatController의 @MessageMapping("/chat/{room_id}")와 매핑됨.
        config.setApplicationDestinationPrefixes("/app"); // 메시지 보낼 경로 (클라이언트 -> 서버로 요청)
    }

	// STOMP 엔드포인트 등록
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // 소켓 연결 주소 => 프론트 엔드 new SockJS("/ws")로 연결
                .setAllowedOriginPatterns("*") // CORS 허용 (모든 도메인 허용)
                .withSockJS(); // 브라우저가 WebSocket을 지원하지 않을 때 대체 프로토콜 (SockJS)로 fallback 지원 허용
    }
}
