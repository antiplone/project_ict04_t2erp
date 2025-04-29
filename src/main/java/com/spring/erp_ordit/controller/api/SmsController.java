package com.spring.erp_ordit.controller.api;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

@RestController
@RequestMapping("/sms")
@CrossOrigin
public class SmsController {
	
	final DefaultMessageService messageService;

    public SmsController() {
        // 발급받은 API KEY를 넣어준다
        this.messageService = NurigoApp.INSTANCE.initialize("NCS9LKDVEW3RAZKP", "FPS0RGTLNWMPJ4HSY0BXHUP29YCF8RWJ", "https://api.coolsms.co.kr");
    }
	
	@PostMapping("/sendSms")
    public SingleMessageSentResponse sendOne(@RequestBody Map<String, String> request) {	// 프론트에서 JSON 데이터를 자바코드로 받아온다
        Message message = new Message();		// CoolSMS에서 제공하는 java 클래스
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom("01068270904");		// 발신자 고정
        message.setTo(request.get("to"));		// 수신자
        message.setText(request.get("text"));

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));		// 메세지를 서버로 보낸다
        System.out.println(response);

        return response;
    }	

}
