package com.spring.erp_ordit.service.chatbot;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.spring.erp_ordit.dto.chatbot.GptRequest;
import com.spring.erp_ordit.dto.chatbot.GptResponse;

@Service
public class GptService {

    // FastAPI로 텍스트 분류 요청을 보내는 메서드
    public String classifyText(GptRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        String url = "http://localhost:5000/predict";  // FastAPI 서버 주소

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // GptRequest 객체를 FastAPI로 전달
        HttpEntity<GptRequest> entity = new HttpEntity<>(request, headers);

        try {
            // FastAPI에서 반환하는 GptResponse 객체를 받음
            ResponseEntity<GptResponse> response = restTemplate.postForEntity(url, entity, GptResponse.class);

            // GptResponse에서 label을 추출하여 String으로 반환
            if (response.getBody() != null) {
                return response.getBody().getLabel();  // label만 반환
            } else {
                return "Error: No response body";
            }

        } catch (Exception e) {
            return "Error occurred: " + e.getMessage();  // 예외 발생 시 에러 메시지 반환
        }
    }
}
