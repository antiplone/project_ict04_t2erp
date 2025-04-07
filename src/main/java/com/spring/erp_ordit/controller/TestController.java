package com.spring.erp_ordit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dao.TestDAO;

@RestController
@CrossOrigin
@RequestMapping(value = "/api")
public class TestController {

	@Autowired
	private TestDAO dao; // mappers/TestMapper.xml에 연결되어 있습니다.

	/* application.yml에서 profiles.active: publish 일때 작동 */
	@GetMapping(value = "/publishTest")
	private String publishTest() {
		return dao.getMem();
	}

	/*
	 * application.yml에서 profiles.active: mytest 일때 작동
	 * 만약 개인적으로 자신의 컴퓨터 DB에 연결하실꺼면, mytest로 해놓고,
	 * application-mytest.yml의 정보를 바꾸시면 됩니다.
	 * url: jdbc:mariadb://localhost:3306/DB명 으로 바꾸면 자신의 컴퓨터 DB로 합니다.
	 * 
	 * spring.datasource.driver-class-name: oracle.jdbc.driver.OracleDriver
	 * spring.datasource.url: jdbc:oracle:thin:@localhost:1521:xe
	 * 
	 * spring.jpa.database-platform=org.hibernate.dialect.Oracle12cDialect
	 * 이렇게 바꾸면 Oracle DB접근
	 */
	@GetMapping(value = "/localTest")
	private String localTest() {
		return dao.getEmp();
	}
}
