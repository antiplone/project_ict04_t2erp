package com.spring.erp_ordit.controller.chat;

import com.spring.erp_ordit.dto.chatbot.*;
import com.spring.erp_ordit.service.chatbot.GptService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// REST 컨트롤러임을 명시하고 요청 경로 설정
@RestController
@RequestMapping("/classify")
@CrossOrigin(origins = "*")
public class GptController {

    private final GptService gptService;

    public GptController(GptService gptService) {
        this.gptService = gptService;
    }

    // POST 요청 처리
    @PostMapping
    public ResponseEntity<?> classify(@RequestBody GptRequest request) {
        return ResponseEntity.ok(gptService.classifyText(request));
    }
}