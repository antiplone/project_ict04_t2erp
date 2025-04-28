package com.spring.erp_ordit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration		// 설정 파일(서버가 어떻게 동작해야 하는지 적어놓은 파일), 스프링한테 설정파일임을 알려주는 어노테이션, 스프링이 서버 켤 때 자동으로 읽게 만든다
public class WebConfig implements WebMvcConfigurer {		// WebMvcConfigurer 인터페이스를 구현해서 설정을 커스터마이징한다(기본적으로 제공하는 동작 방식을 내가 원하는 방식으로 바꿔 설정하겠다는 의미)
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {		// 어떤 url로 요청이 오면 어느 폴더에서 파일을 찾을 지 등록하고 설정
	    registry.addResourceHandler("/upload/**")				// 누군가 브라우저 주소창에서 "/upload/**" 처럼 접속하면 요청 감지해서 따로 지정한 폴더에서 파일 찾아준다 
    			.addResourceLocations("file:" + System.getProperty("user.dir") + "/src/upload/"); 		// 실제 src/upload/ 폴더안에서 파일을 찾아서 보여준다, 자바에서 url 경로랑 헷갈릴 수 있으니 file:을 붙인다
	}
}
