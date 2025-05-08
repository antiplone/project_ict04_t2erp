package com.spring.erp_ordit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.spring.erp_ordit.security.JwtAuthenticationFilter;
import com.spring.erp_ordit.security.JwtTokenUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final UserDetailsService userDetailsService;
	private final JwtTokenUtil jwtTokenUtil;
//	private final UserRepository userRepository;

	public SecurityConfig(UserDetailsService userDetailsService, JwtTokenUtil jwtTokenUtil
			/*, UserRepository userRepository*/) {
		this.userDetailsService = userDetailsService;
		this.jwtTokenUtil = jwtTokenUtil;
//		this.userRepository = userRepository;
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http)
			throws Exception {

		http
			.csrf(csrf -> csrf.disable())
			.requiresChannel(requiresChannel -> 
				requiresChannel
					.anyRequest()
//					.requiresSecure()
			)
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

		return http.build();
	}

//	@Bean
//	PasswordEncoder passwordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
}