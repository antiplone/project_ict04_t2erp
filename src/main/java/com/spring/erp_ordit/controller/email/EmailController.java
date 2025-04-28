package com.spring.erp_ordit.controller.email;

import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

//EmailController.java by M.D
@RestController
@RequestMapping("/email")
@CrossOrigin(origins = "*") // React 개발 서버 주소
public class EmailController {
	
    @Autowired
    private JavaMailSender mailSender;
    
    private static final long MAX_FILE_SIZE = 10_485_760L; // 10MB
    
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(
    		@RequestParam("to") String to,
    		@RequestParam("subject") String subject,
    		@RequestParam("text") String text,
    		@RequestParam(value = "files", required = false) MultipartFile[] files
    	) {
    		try {
    			
    			MimeMessage message = mailSender.createMimeMessage();
    			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

    			helper.setTo(to);
    			helper.setSubject(subject);
    			helper.setText(text, false);

    			if (files != null) {
    			    for (MultipartFile file : files) {
    			        if (!file.isEmpty()) {
    			            if (file.getSize() > MAX_FILE_SIZE) {
    			                return ResponseEntity
    			                        .badRequest()
    			                        .body("첨부파일 " + file.getOriginalFilename() + "의 크기가 10MB를 초과했습니다.");
    			            }
    			            helper.addAttachment(file.getOriginalFilename(), file);
    			        }
    			    }
    			}

    			mailSender.send(message);
    			return ResponseEntity.ok("이메일 발송 성공!");
    			
    		} catch (Exception e) {
    			e.printStackTrace();
    			return ResponseEntity.status(500)
    					.body("이메일 발송 실패!! 오류: " + e.getMessage());
    		}
    	}
	}