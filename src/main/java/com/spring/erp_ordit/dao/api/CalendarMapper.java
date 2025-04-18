package com.spring.erp_ordit.dao.api;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.api.CalendarDTO;

@Mapper		// DAOImpl을 만들지 않고 여기서 만들겠다는 의미
@Repository
public interface CalendarMapper {

	// 캘린더 리스트
	public List<CalendarDTO> getAllEvents();
	
}
