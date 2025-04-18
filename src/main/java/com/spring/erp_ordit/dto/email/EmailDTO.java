package com.spring.erp_ordit.dto.email;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data					// @Getters + @Setters 
@AllArgsConstructor		// 매개변수 생성자 
@NoArgsConstructor		// 디폴트 생성자
@ToString				// toString
@Builder
public class EmailDTO {
	private String to;
	private String subject;
	private String body;

}