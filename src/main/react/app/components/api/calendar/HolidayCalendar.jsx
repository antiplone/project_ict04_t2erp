/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Form, Modal } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import { useToast } from '#components/common/ToastProvider';

const API_KEY = "AIzaSyBmlkUkawpzTaA1PqQutLzv_nQ5ZioqIXk"; // 본인 Google API 키
const CALENDAR_ID = "ko.south_korea#holiday@group.v.calendar.google.com"; // 한국 공휴일 캘린더

// 쉬지 않는 공휴일 수동 리스트
const nonHolidayOffDates = [
  "2025-04-05", // 식목일
  "2025-05-01", // 노동절
  "2025-05-08", // 어버이날
  "2025-05-15", // 스승의 날
];

export default function HolidayCalendar() {
  const fetchURL = AppConfig.fetch['mytest'];
  const calendarURL = `${fetchURL.protocol}${fetchURL.url}/api/calendar`;

  // 상태값들 정의
  const calendarRef = useRef();
  const [holidays, setHolidays] = useState([]);      // 공휴일 목록
  const [calendarDate, setCalendarDate] = useState(new Date()); // 현재 보고있는 달력 기준 날짜
  const [userEvents, setUserEvents] = useState([]);  // 사용자 일정
  const [modalOpen, setModalOpen] = useState(false); // 일정 추가 모달
  const [newEventDate, setNewEventDate] = useState(""); // 클릭한 날짜
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    allDay: false,
    eventType: ""
  });

  const { showToast } = useToast();

  // 공휴일 + 사용자 일정 중복 제거
  const mergedEvents = useMemo(() => {
    const all = [...holidays, ...userEvents];
    const map = new Map();
    for (const e of all) {
      const key = `${e.start}-${e.title}`;
      if (!map.has(key)) map.set(key, e);
    }
    return Array.from(map.values());
  }, [holidays, userEvents]);

  // 일정 불러오기
  const fetchUserEvents = useCallback(async () => {
    try {
      const res = await fetch(`${calendarURL}/getAllEvents`);
      const data = await res.json();
      const events = (data || []).filter(item => item.calTitle).map(item => ({
        title: item.calTitle,
        start: new Date(item.calStartDate),
        end: new Date(item.calEndDate),
        allDay: item.calAllDay === 'Y',
        description: item.calDescription,
        location: item.calLocation,
        eventType: item.calEventType,
      }));
      setUserEvents(events);
    } catch (e) {
      console.error("⛔ 사용자 일정 조회 실패:", e);
    }
  }, [calendarURL]);

  // 공휴일 불러오기
  useEffect(() => {
    async function fetchHolidays() {
      try {
        const year = calendarDate.getFullYear();
        const yearStart = `${year}-01-01T00:00:00Z`;
        const yearEnd = `${year}-12-31T23:59:59Z`;
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${yearStart}&timeMax=${yearEnd}&singleEvents=true&orderBy=startTime`;
        const res = await fetch(url);
        const data = await res.json();

        const events = data.items.map(item => {
          const start = item.start.date;
          let end = item.end.date;
          if (end && end !== start) {
            const endDate = new Date(end);
            endDate.setDate(endDate.getDate() - 1);
            end = endDate.toISOString().slice(0, 10);
          }
          return {
            title: item.summary.replace("쉬는 날 ", ""),
            start,
            end,
            allDay: true,
          };
        });

        setHolidays(events);
      } catch (e) {
        console.error("⛔ 공휴일 불러오기 실패:", e);
      }
    }
    fetchHolidays();
    fetchUserEvents();
  }, [calendarDate]);

  // 날짜 클릭 시 → 모달 열기 + 날짜 세팅
  const dateClick = (info) => {
    setNewEventDate(info.dateStr);
    setModalOpen(true);
  };

  // 일정 저장
  const addEvent = async () => {
    if (!newEvent.title.trim()) return;
    const startDateTime = newEvent.startTime ? `${newEventDate}T${newEvent.startTime}:00` : `${newEventDate}T00:00:00`;
    const endDateTime = newEvent.endTime ? `${newEventDate}T${newEvent.endTime}:00` : `${newEventDate}T00:00:00`;

    try {
      const res = await fetch(`${calendarURL}/insertEvent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calTitle: newEvent.title,
          calStartDate: startDateTime,
          calEndDate: endDateTime,
          calAllDay: newEvent.allDay ? "Y" : "N",
          calDescription: newEvent.description,
          calLocation: newEvent.location,
          calEventType: newEvent.eventType,
          eId: 1
        }),
      });
      if (res.ok) {
        showToast("일정이 등록되었습니다.", "success");
        await fetchUserEvents();
        setModalOpen(false);
      } else {
        showToast("일정 등록 실패", "error");
      }
    } catch (e) {
      console.error("⛔ 일정 등록 실패:", e);
    }
  };

  // 모달 입력값 변경 핸들러
  const onChanges = (key, value) => {
    setNewEvent(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <div style={{ maxWidth: "800px", flex: 1 }}>
          {/* 캘린더 헤더 */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
            <button onClick={() => clickMove("prev")} className="calendar-arrow">←</button>
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>{calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월</span>
            <button onClick={() => clickMove("next")} className="calendar-arrow">→</button>
            <div style={{ position: "absolute", right: 0 }}>
              <button onClick={() => clickMove("today")} className="calendar-today">오늘</button>
            </div>
          </div>

          {/* 캘린더 */}
          <FullCalendar
            ref={calendarRef}
            initialView="dayGridMonth"
            locale="ko"
            headerToolbar={false}
            events={mergedEvents}
            height="auto"
            plugins={[dayGridPlugin, interactionPlugin]}
            dateClick={dateClick}
            eventContent={(arg) => (
              <div style={{
                color: nonHolidayOffDates.includes(arg.event.startStr.slice(0, 10)) ? "#555" : "red",
                fontSize: "10px",
                fontWeight: "bold",
                paddingTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>{arg.event.title}</div>
            )}
          />
        </div>
      </div>

      {/* 일정 추가 모달 */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header><Modal.Title>{newEventDate || "일정 등록"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>날짜</Form.ControlLabel>
              <Form.Control readOnly plaintext value={newEventDate} />
            </Form.Group>

            <Form.Group><Form.ControlLabel>제목</Form.ControlLabel>
              <Form.Control name="title" value={newEvent.title} onChange={v => onChanges("title", v)} /></Form.Group>

            <Form.Group><Form.ControlLabel>시작시간 ~ 종료시간</Form.ControlLabel>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control name="startTime" value={newEvent.startTime} onChange={v => onChanges("startTime", v)} type="time" />
                <Form.Control name="endTime" value={newEvent.endTime} onChange={v => onChanges("endTime", v)} type="time" />
              </div>
            </Form.Group>

            <Form.Group><Form.ControlLabel>장소</Form.ControlLabel>
              <Form.Control name="location" value={newEvent.location} onChange={v => onChanges("location", v)} /></Form.Group>

            <Form.Group><Form.ControlLabel>유형</Form.ControlLabel>
              <Form.Control name="eventType" value={newEvent.eventType} onChange={v => onChanges("eventType", v)} /></Form.Group>

            <Form.Group><Form.ControlLabel>설명</Form.ControlLabel>
              <Form.Control name="description" value={newEvent.description} onChange={v => onChanges("description", v)} /></Form.Group>

            <Form.Group>
              <input type="checkbox" checked={newEvent.allDay} onChange={e => onChanges("allDay", e.target.checked)} /> 종일
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={addEvent}>추가</Button>
          <Button onClick={() => setModalOpen(false)}>취소</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
