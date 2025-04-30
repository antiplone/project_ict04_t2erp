package com.spring.erp_ordit.dao.api;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.spring.erp_ordit.dto.api.CalendarDTO2;

@Mapper		// DAOImpl을 만들지 않고 여기서 만들겠다는 의미
public interface CalendarMapper2 {

    int insertEvent(CalendarDTO2 dto);

    List<CalendarDTO2> selectAllEvents();
}