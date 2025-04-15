package com.spring.erp_ordit.controller.personnel;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.service.personnel.EmpAuthService;

/**
 * 사원인증을 담당하는 RESTful-컨트롤러입니다.
 * 
 * @author YD.전
 * 
 * @see com.spring.erp_ordit.service.personnel.EmpAuthService
 */
@RequestMapping(value = "/auth")
@CrossOrigin
@RestController
public class EmpAuthController {

	@Autowired
	private EmpAuthService service;

	/**
	 * @return 사원인증정보를 브라우저기반-세션으로 보냅니다.
	 * 
	 * @author YD.전
	 */
	@PostMapping(value = "/get")
	public ResponseEntity<?> getAuth(
			@RequestBody Map<String, Object> form,
			HttpSession session
	) {
		System.out.println("인증 정보: " + form);
		ResponseEntity<?> entity;
		Map<String, Object> auth = service.getTransaction(form);

		if (auth != null) {

			entity = ResponseEntity.ok()
									.allow(HttpMethod.POST)
									.contentType(MediaType.APPLICATION_JSON)
									.header(
										"Set-Cookie",
										"JSESSIONID=" + session.getId(),
										"HttpOnly"
									)
									.body(auth);
			System.out.println("entity: " + entity);
		}
		else {
			entity = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
									.build();
		}

		return entity;
	}
}
