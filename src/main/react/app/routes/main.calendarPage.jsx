// app/routes/calendar.jsx 또는 calendarPage.jsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import "@fullcalendar/daygrid/index.css";  // ✅ v6 CSS  => 자꾸 에러남
import React, { useEffect, useState } from "react";
import AppConfig from "#config/AppConfig.json";

export default function CalendarPage() {
  const fetchURL = AppConfig.fetch['mytest'];
  const [events, setEvents] = useState([
    { title: '회의', date: '2025-04-20' },
    { title: '출근', date: '2025-04-21' },
  ]);

  useEffect(() => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/api/calendar/getAllEvents`)
      .then((res) => res.json())
      .then((res) => setEvents(res));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* <h2>📅 근태 캘린더</h2> */}
      <FullCalendar
        plugins={[dayGridPlugin]}  // 사용할 뷰 등록
        initialView="dayGridMonth" // 초기 뷰: 월간
        events={events}            // 이벤트(일정) 리스트
        height="auto"              // 높이 자동 조절
        locale="ko"                // 한글 설정 (원하면 moment/locales 필요)
      />
    </div>
  );
}
