package com.spring.erp_ordit.controller.personnel;

import java.sql.Date;
import java.text.DateFormat;
import java.time.ZoneId;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.service.personnel.EmpAuthService;

import javax.servlet.http.HttpSession;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 사원인증을 담당하는 RESTful-컨트롤러입니다.
 * 
 * @author YD.전
 */
@RequestMapping(value = "/auth")
@CrossOrigin(origins = "*")
@RestController
public class EmpAuthController {

	@Autowired
	private EmpAuthService service;

	/**
	 * @return 사원인증정보
	 * 
	 * @author YD.전
	 */
	@PostMapping(value = "/get")
	public ResponseEntity<?> getAuth(@RequestBody Map<String, Object> form) {
		System.out.println("인증 정보: " + form);

		DateFormat dateFormat = DateFormat.getInstance();
		TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.SHORT_IDS.get("JST")));
		dateFormat.setTimeZone(TimeZone.getDefault());

		ResponseEntity<?> entity;
		Map<String, Object> auth = service.getTransaction(form);

		if (auth != null) {

			String curDate = dateFormat.format(new Date(System.currentTimeMillis()));
			auth.put("timestamp", curDate);

			entity = ResponseEntity.ok()
//									.header(null, null)
					.body(auth);

			System.out.println("entity: " + entity);
		} else {
			entity = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		return entity;
	}
}
