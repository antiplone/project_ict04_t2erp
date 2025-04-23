package com.spring.erp_ordit.controller.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.spring.erp_ordit.service.chatbot.ChatbotService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String response = chatbotService.getResponse(message);
        
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("response", response);
        
        return ResponseEntity.ok(responseBody);
    }
} 