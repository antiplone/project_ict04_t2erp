package com.spring.erp_ordit.service.chatbot;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ChatbotService {
    // 키워드에 따라 챗봇 응답을 저장하는 맵
    private final Map<String, String> responses;

    // 생성자에서 응답 초기화 메서드 호출
    public ChatbotService() {
        responses = new HashMap<>();
        initializeResponses();
    }

    // 기본 응답들을 초기화하는 메서드
    private void initializeResponses() {
				responses.put("hello", "안녕하세요! 무엇을 도와드릴까요?"); // 인사 응답
		    responses.put("help", "다음과 같은 도움을 드릴 수 있어요:\n- 제품 정보\n- 주문 상태\n- 계정 문제\n- 일반 문의\n궁금한 내용을 말씀해 주세요!"); // 도움말 응답
				responses.put("contact", "고객지원팀에 문의하려면 derekformail@gmail.com 으로 이메일을 보내시거나 010-2802-0910 번호로 전화주세요."); // 연락처 정보
				responses.put("default", "죄송합니다. 잘 이해하지 못했어요. 질문을 다시 말씀해주시거나 고객지원팀에 문의해 주세요."); // 기본 응답
    }

    // 사용자 메시지를 받아 적절한 응답을 반환하는 메서드
    public String getResponse(String message) {
        // 메시지를 소문자로 변환하고 공백 제거
        message = message.toLowerCase().trim();
        
        // 특정 키워드가 포함되어 있는지 확인하고 대응되는 응답 반환
        if (message.contains("hello") || message.contains("hi")) {
            return responses.get("hello");
        } else if (message.contains("help")) {
            return responses.get("help");
        } else if (message.contains("contact") || message.contains("support")) {
            return responses.get("contact");
        }

        // 조건에 해당하지 않으면 기본 응답 반환
        return responses.get("default");
    }
}
