package com.spring.erp_ordit.controller.email;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;

// spring boot 내부
import com.spring.erp_ordit.dto.email.EmailDTO;
import com.spring.erp_ordit.service.email.EmailService;

//MailController.java
@RestController
@RequestMapping("/email")
@CrossOrigin(origins = "*") // React 개발 서버 주소
public class EmailController {
	
    @Autowired
    private EmailService emailService;
    
    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailDTO emailDTO) {
        try {
            emailService.sendEmail(emailDTO);
            Properties props = new Properties();
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication("your@gmail.com", "앱비밀번호");
                }
            });
            session.setDebug(true);
            return "이메일이 성공적으로 발송되었습니다.";
        } catch (Exception e) {
            return "이메일 발송 실패: " + e.getMessage();
        }
    }
}

//    @PostMapping("/send")
//    public ResponseEntity<?> sendDynamic(
//            @RequestBody MailRequest request,
//            @AuthenticationPrincipal UserDetails userDetails // 로그인 정보
//    ) {
//        // 예시로 사용자 이메일과 앱 비밀번호를 직접 가져온다고 가정
//        // 실무에서는 DB에서 사용자별 메일 설정 정보를 가져오도록 구현
//
//        String email = userDetails.getUsername(); // 로그인한 이메일
//        String appPassword = userService.getAppPasswordByEmail(email); // DB 등에서 조회
//
//        UserMailConfig config = new UserMailConfig();
//        config.setEmail(email);
//        config.setAppPassword(appPassword);
//
//        mailService.sendDynamicMail(config, request);
//
//        	emailService.sendMail(config, request);
//            return ResponseEntity.ok("메일 전송 성공");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("메일 전송 실패");
//        }
//    }
//}
