package com.spring.erp_ordit.controller.personnel;

import java.util.Map;

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
		ResponseEntity<?> entity;
		Map<String, Object> auth = service.getTransaction(form);

		if (auth != null) {
			entity = ResponseEntity.ok()
//									.header(null, null)
									.body(auth);
			System.out.println("entity: " + entity);
		}
		else {
			entity = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
									.build();
		}

		return entity;
	}
//	@PostMapping(value = "/get")
//	public ResponseEntity<?> getAuth(@RequestBody Map<String, Object> form) {
//	    System.out.println("인증 정보: " + form);
//	    
//	    Map<String, Object> auth = service.getTransaction(form);
//
//	    if (auth != null && auth.get("e_id") != null && auth.get("e_name") != null) {
//	        // 명시적으로 key 지정해서 프론트가 안정적으로 받을 수 있게 구성
//	        Map<String, Object> response = Map.of(
//	            "e_id", auth.get("e_id"),
//	            "e_name", auth.get("e_name"),
//	            "message", "로그인 성공"
//	        );
//
//	        return ResponseEntity.ok(response);
//	    } else {
//	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
//	    }
//	}

	
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
	    HttpSession session = request.getSession(false); // false: 기존 세션이 없으면 null 반환
	    if (session != null) {
	        session.invalidate(); // 세션 무효화
	        System.out.println("세션이 만료되었습니다.");
	    }
	    
	    // 클라이언트 쿠키도 삭제
	    Cookie cookie = new Cookie("JSESSIONID", null);
	    cookie.setPath("/");
	    cookie.setMaxAge(0);
	    response.addCookie(cookie);
	    
	    return ResponseEntity.ok().body("세션이 만료되었습니다.");
	}

}
