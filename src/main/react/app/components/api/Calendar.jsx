/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Form, Modal } from "rsuite";
import AppConfig from "#config/AppConfig.json";

const API_KEY = "AIzaSyBmlkUkawpzTaA1PqQutLzv_nQ5ZioqIXk"; // 본인 Google API 키
const CALENDAR_ID = "ko.south_korea#holiday@group.v.calendar.google.com"; // 한국 공휴일 캘린더

export default function Calendar() {
  const fetchURL = AppConfig.fetch['mytest'];
  const calendarURL = `${fetchURL.protocol}${fetchURL.url}/api/calendar`;

  const calendarRef = useRef();
  const [holidays, setHolidays] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date()); // 월별 이동용 상태
  const [userEvents, setUserEvents] = useState([]);             // 캘린더 따로 관리할 상태

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");


  // 쉬지 않는 공휴일 수동 리스트
  const nonHolidayOffDates = [
    "2025-04-05", // 식목일
    "2025-05-01", // 노동절
    "2025-05-08", // 어버이날
    "2025-05-15", // 스승의 날
  ];

  // 버튼으로 월별 이동
  const clickMove = (type) => {
    const calendarApi = calendarRef.current.getApi();
    if (type === "prev") calendarApi.prev();
    if (type === "next") calendarApi.next();
    if (type === "today") calendarApi.today();
    setCalendarDate(new Date(calendarApi.getDate()));
  };

  // 공휴일 불러오기
  useEffect(() => {
    async function fetchHolidays() {
      try {
        const yearStart = `${calendarDate.getFullYear()}-01-01T00:00:00Z`;
        const yearEnd = `${calendarDate.getFullYear()}-12-31T23:59:59Z`;
  
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
  
          let fixedTitle = item.summary;
          if (fixedTitle.startsWith("쉬는 날 ")) {
            fixedTitle = fixedTitle.replace("쉬는 날 ", "");
          }
  
          return {
            title: fixedTitle,
            start: start,
            end: end,
            allDay: true,
          };
        });
  
        setHolidays(events);
      } catch (err) {
        console.error("⛔ 공휴일 불러오기 실패:", err);
      }
    }
  
    async function fetchUserEvents() {
      try {
        const res = await fetch(`${calendarURL}/getAllEvents`);
        const data = await res.json();
  
        const events = data.map(item => ({
          title: item.calTitle,
          start: item.calStartDate,
          end: item.calEndDate,
          allDay: item.calAllDay === 'Y',
          description: item.calDescription,
          location: item.calLocation,
          eventType: item.calEventType,
          creacteAt: item.calCreatedAt == "",
          updateAt: item.calUpdatedAt == "",
        }));
  
        setUserEvents(events);
      } catch (error) {
        console.error("⛔ 사용자 일정 불러오기 실패:", error);
      }
    }
  
    fetchHolidays();
    fetchUserEvents();
  }, [calendarDate]);    // 달 이동할 때마다 재조회

  // 날짜 클릭 → 모달 열기
  const dateClick = (info) => {
    setNewEventDate(info.dateStr);
    setNewTitle("");
    setStartTime("");
    setEndTime("");
    setModalOpen(true);
    setNewDescription("");
    setNewLocation("");
  };

  // 일정 추가
  const addEvent = async () => {
    if (!newTitle.trim()) return;
  
    const startDateTime = startTime
      ? `${newEventDate}T${startTime}:00`   // 시:분 이니까 초(`:00`)도 붙여줌
      : `${newEventDate}T00:00:00`;         // 시간 없으면 00:00:00
  
    const endDateTime = endTime
      ? `${newEventDate}T${endTime}:00`
      : `${newEventDate}T00:00:00`;
  
    try {
      const response = await fetch(`${calendarURL}/insertEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calTitle: newTitle,
          calStartDate: startDateTime,
          calEndDate: endDateTime,
          calAllDay: (!startTime && !endTime) ? "Y" : "N",
          calDescription: newDescription,
          calLocation: newLocation,
          calEventType: "사용자",
          eId: 1
        }),
      });
  
      if (response.ok) {
        console.log("✅ DB 저장 완료");
  
        setUserEvents(prev => [
          ...prev,
          {
            title: newTitle,
            start: startDateTime,
            end: endDateTime,
            allDay: !startTime && !endTime,
          }
        ]);
        setModalOpen(false);
      } else {
        console.error("⛔ 서버 저장 실패");
      }
    } catch (error) {
      console.error("⛔ 오류:", error);
    }
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 커스텀 헤더 */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // 가운데 정렬
          gap: "12px",               // 간격 조정
          marginBottom: "8px"
        }}>
          <button onClick={() => clickMove("prev")} className="calendar-arrow">←</button>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            {calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월
          </span>
          <button onClick={() => clickMove("next")} className="calendar-arrow">→</button>
          <div style={{ position: "absolute", right: "0px" }}>
            <button onClick={() => clickMove("today")} className="calendar-today">오늘</button>
          </div>
        </div>

        {/* FullCalendar */}
        <FullCalendar
          ref={calendarRef}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={false}
          events={[...holidays, ...userEvents]}
          height={"auto"}
          plugins={[dayGridPlugin, interactionPlugin]}
          dateClick={dateClick}

          // 공휴일 날짜(휴일이라면 빨간색, 아니면 검정색)
          eventContent={(arg) => {
            const eventDate = arg.event.startStr.slice(0, 10); // YYYY-MM-DD
            const isNoHoliday = nonHolidayOffDates.includes(eventDate); // 쉬지 않는 공휴일이면 true
          
            return (
              <div style={{
                color: isNoHoliday ? "#555" : "red", // 🔥 쉬지 않으면 검정, 쉬면 빨강
                fontSize: "10px",
                fontWeight: "bold",
                paddingTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {arg.event.title}
              </div>
            );
          }}
          
          // 공휴일 날짜(휴일이라면 빨간색, 아니면 inherit)
          // dayCellContent={(arg) => {
          //   // 한국시간으로 보정
          //   const year = arg.date.getFullYear();
          //   const month = String(arg.date.getMonth() + 1).padStart(2, '0');
          //   const day = String(arg.date.getDate()).padStart(2, '0');
          //   const dateStr = `${year}-${month}-${day}`;
          
          //   const isHoliday = holidays.some(h => h.start === dateStr);
          //   const isOffDay = !nonHolidayOffDates.includes(dateStr);
          
          //   return (
          //     <div style={{ color: isHoliday ? (isOffDay ? "red" : "black") : "inherit" }}>{arg.dayNumberText}</div>
          //   );
          // }}
          
          dayCellContent={(arg) => {
            const year = arg.date.getFullYear();
            const month = String(arg.date.getMonth() + 1).padStart(2, '0');
            const day = String(arg.date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
          
            const isHoliday = holidays.some(h => h.start === dateStr);
            const isNoHoliday = nonHolidayOffDates.includes(dateStr); // 🔥 쉬지 않는 공휴일 여부
          
            const textColor = isHoliday
              ? (isNoHoliday ? "inherit" : "red") // 🔥 쉬지 않는 공휴일이면 검정색, 쉬는 공휴일이면 빨강
              : "inherit";                     // 일반날짜는 기본
          
            return (
              <div style={{ color: textColor }}>
                {arg.dayNumberText}
              </div>
            );
          }}
          
        />
      </div>

      {/* 일정 추가 모달 */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>일정 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>날짜</Form.ControlLabel>
              <Form.Control readOnly plaintext name="title" value={newEventDate} />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>제목</Form.ControlLabel>
              <Form.Control
                name="title"
                value={newTitle}
                onChange={value => setNewTitle(value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>시작 시간</Form.ControlLabel>
              <Form.Control
                name="startTime"
                value={startTime}
                onChange={value => setStartTime(value)}
                type="time"
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>종료 시간</Form.ControlLabel>
              <Form.Control
                name="endTime"
                value={endTime}
                onChange={value => setEndTime(value)}
                type="time"
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>일정 설명</Form.ControlLabel>
              <Form.Control
                name="description"
                value={newDescription}
                onChange={value => setNewDescription(value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>장소</Form.ControlLabel>
              <Form.Control
                name="location"
                value={newLocation}
                onChange={value => setNewLocation(value)}
              />
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
