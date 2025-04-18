package com.spring.erp_ordit.service.email;

// spring 내부 
import com.spring.erp_ordit.dto.email.EmailDTO;

public interface EmailService {
    void sendEmail(EmailDTO emailRequest);
}