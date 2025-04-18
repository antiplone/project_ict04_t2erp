package com.spring.erp_ordit.service.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.api.CalendarMapper;
import com.spring.erp_ordit.dto.api.CalendarDTO;

@Service
public class CalendarService {
	@Autowired
	private CalendarMapper dao;
	
	// 캘린더 리스트
	public List<CalendarDTO> getAllEvents() {
	    System.out.println("▶ CalendarService - 캘린더 리스트");
		return dao.getAllEvents();
	}
}
