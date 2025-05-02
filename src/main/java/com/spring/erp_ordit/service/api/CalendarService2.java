package com.spring.erp_ordit.service.api;

import java.net.URL;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring.erp_ordit.dao.api.CalendarMapper2;
import com.spring.erp_ordit.dto.api.CalendarDTO2;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalendarService2 {

    private final CalendarMapper2 dao;

    private static final String API_KEY = "AIzaSyBmlkUkawpzTaA1PqQutLzv_nQ5ZioqIXk";
    private static final String CALENDAR_ID = "ko.south_korea#holiday@group.v.calendar.google.com";	// 한국 공휴일 캘린더 ID

    // 2025년 공휴일을 Google API에서 가져와 DB 저장
    public int insertAllHolidaysFromGoogle() {
        int insertedCount = 0;
        try {
            String urlStr = String.format(
                "https://www.googleapis.com/calendar/v3/calendars/%s/events?key=%s&timeMin=2025-01-01T00:00:00Z&timeMax=2025-12-31T23:59:59Z&singleEvents=true&orderBy=startTime",
                java.net.URLEncoder.encode(CALENDAR_ID, "UTF-8"), API_KEY
            );

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(new URL(urlStr));
            JsonNode items = root.path("items");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    String title = item.path("summary").asText();
                    String start = item.path("start").path("date").asText();
                    String end = item.path("end").path("date").asText();

                    // end 날짜는 하루 빼서 저장
                    if (end != null && !end.equals(start)) {
                        java.time.LocalDate endDate = java.time.LocalDate.parse(end);
                        endDate = endDate.minusDays(1);
                        end = endDate.toString();
                    }

                    CalendarDTO2 dto = CalendarDTO2.builder()
                        .calTitle(title)
                        .calStartDate(start)
                        .calEndDate(end)
                        .calAllDay("Y")
                        .calDescription(null)
                        .calLocation(null)
                        .calEventType("휴일")
                        .eId(1) // 관리자 ID 1
                        .build();

                    insertedCount += dao.insertEvent(dto);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return insertedCount;
    }

    public int insertEvent(CalendarDTO2 dto) {
        return dao.insertEvent(dto);
    }

    public List<CalendarDTO2> getAllEvents() {
        return dao.selectAllEvents();
    }
}
