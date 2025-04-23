package com.spring.erp_ordit.service.chatbot;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ChatbotService {
    private final Map<String, String> responses;

    public ChatbotService() {
        responses = new HashMap<>();
        initializeResponses();
    }

    private void initializeResponses() {
        responses.put("hello", "Hello! How can I help you today?");
        responses.put("help", "I can help you with:\n- Product information\n- Order status\n- Account issues\n- General inquiries\nJust ask your question!");
        responses.put("contact", "You can reach our support team at support@erp.com or call us at 1-800-ERP-HELP");
        responses.put("default", "I'm not sure about that. Could you please rephrase your question or contact our support team?");
    }

    public String getResponse(String message) {
        message = message.toLowerCase().trim();
        
        if (message.contains("hello") || message.contains("hi")) {
            return responses.get("hello");
        } else if (message.contains("help")) {
            return responses.get("help");
        } else if (message.contains("contact") || message.contains("support")) {
            return responses.get("contact");
        }
        
        return responses.get("default");
    }
} 