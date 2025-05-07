package com.spring.erp_ordit.dao.api;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.spring.erp_ordit.dto.api.CalendarDTO;

@Mapper		// DAOImpl을 만들지 않고 여기서 만들겠다는 의미
public interface CalendarMapper {

    public int insertEvent(CalendarDTO dto);

    public List<CalendarDTO> selectAllEvents();
    
    public int deleteEvent(int cal_event_id);		// 일정 삭제

	public int updateEvent(CalendarDTO dto);	// 일정 수정
}