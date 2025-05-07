/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Form, Modal, Schema } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import TodaySchedule from "./TodaySchedule";

const API_KEY = "AIzaSyBmlkUkawpzTaA1PqQutLzv_nQ5ZioqIXk"; // 본인 Google API 키
const CALENDAR_ID = "ko.south_korea#holiday@group.v.calendar.google.com"; // 한국 공휴일 캘린더

// 쉬지 않는 공휴일 수동 리스트
const nonHolidayOffDates = [
  "2025-04-05", // 식목일
  "2025-05-01", // 노동절
  "2025-05-08", // 어버이날
  "2025-05-15", // 스승의 날
];
  
export default function HolidayCalendars() {
  const fetchURL = AppConfig.fetch['mytest'];
  const calendarURL = `${fetchURL.protocol}${fetchURL.url}/api/calendar`;
  const storedID = Number(localStorage.getItem("e_id"));

  // 캘린더의 상태 관리
  const calendarRef = useRef();   // FullCalendar 컴포넌트를 직접 조작할 수 있도록 참조를 저장하는 변수
  const [holidays, setHolidays] = useState([]);                 // 공휴일 정보를 저장
  const [calendarDate, setCalendarDate] = useState(new Date()); // 현재 보고 있는 달력을 기준으로 날짜를 저장
  const [userEvents, setUserEvents] = useState([]);             // 사용자가 추가한 일정을 저장
  const [todaySche, setTodaySche] = useState(null);             // 오늘 일정 클릭 상태

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);

  // 새 일정을 추가할 때 필요한 컬럼들을 저장
  const [newEventDate, setNewEventDate] = useState("");   // 날짜
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    allDay: false,
    eventType: ""
  });

  // '종일'이라면 종료시간도 오늘 날짜로 설정
  const onChanges = (field, value) => {
    const checked = e.target.checked;

    setNewEvent(prev => {
      if (field === "allDay") {
        if (value) {
          return {
            ...prev,
            allDay: checked,
            endTime: prev.startTime // 종일이면 종료시간 = 시작시간
          };
        } else {
          return {
            ...prev,
            allDay: false,
            endTime: ""   // 시간 선택 가능하도록 비워두기
          };
        }
      }
      return { ...prev, [field]: value };
    });
  };

  // 공휴일 API + 사용자 DB로 가져오기 때문에, 중복 제거 
  const mergedEvents = useMemo(() => {
    const all = [...holidays, ...userEvents];

    const map = new Map();
    for (const e of all) {
      // const key = `${e.start}-${e.title}`; // 날짜 + 제목 기준으로 유일하게
      
      const dateKey = typeof e.start === 'string'
        ? e.start
        : e.start.toISOString().slice(0, 10);
        const key = `${dateKey}-${e.title}-${e.source}`;
      
      if (!map.has(key)) {
        map.set(key, e);
      }
    }

    return Array.from(map.values());  // 중복 제거된 배열 반환
  }, [holidays, userEvents]);

  const { StringType } = Schema.Types;
  const model = Schema.Model({    // Schema
    cal_title: StringType()
      .isRequired("제목을 입력해주세요")
      .minLength(1, "1글자 이상 입력해주세요"),

    cal_start_date: StringType()
      .isRequired("시작 날짜를 선택해주세요"),
      
    cal_event_type: StringType()
    .isRequired("일정 유형을 입력해주세요")
    .minLength(1, "1글자 이상 입력해주세요"),

    cal_all_day: StringType()
      .pattern(/^[YN]$/, "Y 또는 N만 입력 가능합니다")
      .isRequired("종일 여부를 입력해주세요"),
  });

  // 사용자 일정 불러오기 함수 (재사용을 위해 useCallback으로 분리)
  const fetchUserEvents = useCallback(async () => {
    try {
      const res = await fetch(`${calendarURL}/getAllEvents`);
      const data = await res.json();
      // console.log("📥 raw data from server:", data);

      // 한국 시간으로 보정
      const toKST = (dateStr) => {
        const d = new Date(dateStr);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d;
      };

      const events = (data || [])
        .filter(item => item && item.calTitle)
        .filter(item => item.isHoliday !== "Y")  // db에 있는 공휴일 포함x
        .map(item => {
        return {
          cal_event_id: item.calEventId,
          id: item.calEventId,
          title: item.calTitle,
          start: toKST(item.calStartDate),
          end: toKST(item.calEndDate),
          allDay: item.calAllDay === 'Y',
          description: item.calDescription,
          location: item.calLocation,
          eventType: item.calEventType,
          source: "db",
        };
      });
      // console.log("🎯 서버에서 받은 데이터", data);
      setUserEvents(events);
    } catch (error) {
      console.error("⛔ 사용자 일정 불러오기 실패:", error);
    }
  }, [calendarURL]);

  // 페이지 처음 로딩할 때, 오늘 일정을 자동으로 띄우기 위해 실행
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    setTodaySche(todayStr);
  }, []);
  
  // 버튼으로 월별 이동이 가능한 함수
  const clickMove = (type) => {
    const calendarApi = calendarRef.current.getApi();
    if (type === "prev") calendarApi.prev();
    if (type === "next") calendarApi.next();
    if (type === "today") calendarApi.today();
    setCalendarDate(new Date(calendarApi.getDate()));
  };

  // 공휴일 및 사용자 일정 불러오기(api)
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
            source: "google",
          };
        });

        setHolidays(events);
      } catch (err) {
        console.error("⛔ 공휴일 불러오기 실패:", err);
      }
    }
    fetchHolidays();
  }, [calendarDate]);
  
  useEffect(() => {
    fetchUserEvents();  // db
  }, []);

  // 날짜 클릭 → todaySche 세팅
  const dateClick = (info) => {
    setTodaySche(info.dateStr);
  };

  // 일정 추가
  const addEvent = async () => {
    if (!newEvent.title.trim()) return;

    const startDateTime = newEvent.startTime
    ? `${newEventDate}T${newEvent.startTime}:00`
    : `${newEventDate}T00:00:00`;

  const endDateTime = newEvent.allDay
    ? startDateTime
    : (newEvent.endTime
        ? `${newEventDate}T${newEvent.endTime}:00`
        : `${newEventDate}T00:00:00`);

    try {
      const response = await fetch(`${calendarURL}/insertEvent`, {
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
          eId: storedID
        }),
      });
      if (response.ok) {
        console.log("✅ DB 저장 완료");
        await fetchUserEvents();
        setModalOpen(false);
      } else {
        console.error("서버 저장 실패");
      }
    } catch (error) {
      console.error("오류:", error);
    }
  };

  return (
    <>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "20px" }}>
      {/* 왼쪽 캘린더 영역 */}
      <div style={{ maxWidth: "800px", flex: 1 }}>
        {/* 커스텀 헤더 */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // 가운데 정렬
          gap: "12px",              // 간격 조정
          marginBottom: "8px"
        }}>
          {/* 캘린더 위에 화살표와 현재 달, 오늘로 이동할 수 있는 버튼 */}
          <button onClick={() => clickMove("prev")} className="calendar-arrow">←</button>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            {calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월
          </span>
          <button onClick={() => clickMove("next")} className="calendar-arrow">→</button>
          <div style={{ position: "absolute", right: "0px" }}>
            <button onClick={() => clickMove("today")} className="calendar-today">오늘</button>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          initialView="dayGridMonth" // 초기 달력 뷰를 월별로 설정
          locale="ko"                // 한국어 설정
          headerToolbar={false}      // 원래 헤더 툴바 숨기기
          events={mergedEvents}      // 공휴일과 사용자 일정을 합쳐서 달력에 표시한 이벤트 목록을 설정
          height={"auto"}            // 높이 자동으로 설정
          plugins={[dayGridPlugin, interactionPlugin]}  // 일정 표시를 위한 플러그인과 사용자 상호작용(클릭 등)을 위한 플러그인을 설정
          dateClick={dateClick}      // 클릭 함수

          // 공휴일 날짜(휴일이라면 빨간색, 아니면 검정색)
          eventContent={(arg) => {
            const eventDate = arg.event.startStr.slice(0, 10); // YYYY-MM-DD
            const isNoHoliday = nonHolidayOffDates.includes(eventDate); // 쉬지 않는 공휴일이면 true
          
            const isFromGoogle = arg.event.extendedProps.source === "google";
            const color = isFromGoogle
              ? (isNoHoliday ? "#555" : "red") // 공휴일이면 빨강, 쉬지 않으면 검정
              : "#000";                        // DB일정은 검정

            return (
              <div style={{
                color: color,
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
          
          // 공휴일과 쉬지 않는 공휴일을 구분해서, 해당 날짜가 공휴일인지 체크하는 함수
          dayCellContent={(arg) => {
            // arg.date: 클릭한 날짜나 그 셀에 해당하는 날짜 객체를 뜻한다.
            const year = arg.date.getFullYear();
            const month = String(arg.date.getMonth() + 1).padStart(2, '0');
            const day = String(arg.date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
          
            // holidays: 이미 불러온 공휴일 리스트이다.
            const isHoliday = holidays.some(h => h.start === dateStr);
            const isNoHoliday = nonHolidayOffDates.includes(dateStr); // 쉬지 않는 공휴일 여부 확인
          
            const textColor = isHoliday
              ? (isNoHoliday ? "inherit" : "red") // 쉬지 않는 공휴일이면 검정색, 쉬는 공휴일이면 빨강색
              : "inherit";                        // 일반날짜는 기본색
          
            return (
              <div style={{ color: textColor }}>
                {arg.dayNumberText}
              </div>
            );
          }}
        />
      </div>

      {/* 오른쪽 일정 카드 영역 */}
      <div style={{ width: "400px", flexShrink: 0, marginTop: 38 }}>
        <TodaySchedule userEvents={userEvents} todaySche={todaySche} onAdd={fetchUserEvents} holidays={holidays}/>
      </div>
    </div>

      {/* 일정 추가 모달 */}
      <Modal model={model} open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>일정 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <Form.ControlLabel>날짜</Form.ControlLabel>
                  <Form.Control readOnly plaintext name="title" value={newEventDate} />
                </div>

                <div style={{ display: "flex", alignItems: "center", marginTop: "25px" }}>
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={newEvent.allDay}
                    onChange={(e) => onChanges("allDay", e.target.checked)}
                    style={{ marginRight: "5px" }}
                  />
                  <label htmlFor="allDay" style={{ fontSize: "14px" }}>종일</label>
                </div>
              </div>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>제목</Form.ControlLabel>
              <Form.Control
                name="title"
                value={newEvent.title}
                onChange={value => onChanges("title", value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>시작시간 ~ 종료시간</Form.ControlLabel>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={value => onChanges("startTime", value)}
                  type="time"
                />
                
                <Form.Control
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={value => onChanges("endTime", value)}
                  type="time"
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>일정 설명</Form.ControlLabel>
              <Form.Control
                name="description"
                value={newEvent.description}
                onChange={value => onChanges("description", value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>장소</Form.ControlLabel>
              <Form.Control
                name="location"
                value={newEvent.location}
                onChange={value => onChanges("location", value)}
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
