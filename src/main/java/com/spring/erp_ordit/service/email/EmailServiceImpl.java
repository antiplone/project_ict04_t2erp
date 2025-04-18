package com.spring.erp_ordit.service.email;

import com.spring.erp_ordit.dto.email.EmailDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public void sendEmail(EmailDTO emailDTO) {  // 변경된 DTO 사용
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setTo(emailDTO.getTo());
            messageHelper.setSubject(emailDTO.getSubject());
            messageHelper.setText(emailDTO.getBody(), true);
            messageHelper.setFrom("derekmoonformail@gmail.com");
        };
        javaMailSender.send(messagePreparator);
    }
}
