/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Form, Modal, Schema } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import { useToast } from '#components/common/ToastProvider';
import Btn from "#components/attendance/Btn.jsx";
import "#styles/holiday.css";

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

  // 캘린더의 상태 관리
  const calendarRef = useRef();
  const [holidays, setHolidays] = useState([]);                 // 공휴일 정보를 저장
  const [calendarDate, setCalendarDate] = useState(new Date()); // 현재 보고있는 달력 기준 날짜
  const [userEvents, setUserEvents] = useState([]);             // 사용자가 추가한 일정을 저장
  const [modalOpen, setModalOpen] = useState(false);

  // 새 일정을 추가할 때 필요한 컬럼들을 저장
  const [newEventDate, setNewEventDate] = useState("");         // 클릭한 날짜
  const [calendarData, setCalendarData] = useState({
    cal_title: "",
    cal_start_date: "",
    cal_end_date: "",
    cal_all_day: true,
    cal_location: "",
    cal_event_type: "",
    cal_description: "",
  });
  const { showToast } = useToast();

  // 공휴일 API + 사용자 DB로 가져오기 때문에, 중복 제거 
  const mergedEvents = useMemo(() => {
    const all = [...holidays, ...userEvents];

    const map = new Map();
    for (const e of all) {
      // 시작시간을 항상 ISO 문자열로 변환해서 비교
      const startStr = typeof e.start === "string"
      ? e.start
      : e.start.toISOString().slice(0, 10); // Date → "YYYY-MM-DD"

      const key = `${startStr}-${e.title}`;  // 중복 제거 키

      if (!map.has(key)) {
        map.set(key, {
          ...e,
          start: startStr, // start를 문자열로 강제
          end: startStr,   // end도 맞춰주기 (하루짜리 일정이면 동일하게)
        });
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
      
      const events = (data || [])
      .filter(item => item && item.calTitle)
      .map(item => {
        const start = item.calStartDate.slice(0, 10);
        // const start = new Date(item.calStartDate);
        // const end = new Date(item.calEndDate);
        return {
          title: item.calTitle,
          start,
          end: start,
          // end,
          allDay: item.calAllDay === 'Y',
          description: item.calDescription,
          location: item.calLocation,
          eventType: item.calEventType,
        };
      })
      // ✅ 사용자 일정 중복 제거
      .filter((event, index, self) =>
        index === self.findIndex(
          (e) => e.start === event.start && e.title === event.title
        )
      );
      setUserEvents(events);
    } catch (e) {
      console.error("⛔ 사용자 일정 조회 실패:", e);
    }
  }, [calendarURL]);

  // 버튼으로 월별 이동이 가능한 함수
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
    setCalendarData(info.dateStr);
    setModalOpen(true);
  };

  // 일정 저장
  const addEvent = async () => {
    if (!calendarData.title) return;
    const startDateTime = calendarData.startTime ? `${newEventDate}T${calendarData.startTime}:00` : `${newEventDate}T00:00:00`;
    const endDateTime = calendarData.endTime ? `${newEventDate}T${calendarData.endTime}:00` : `${newEventDate}T00:00:00`;

    try {
      const res = await fetch(`${calendarURL}/insertEvent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calTitle: calendarData.title,
          calStartDate: startDateTime,
          calEndDate: endDateTime,
          calAllDay: calendarData.allDay ? "Y" : "N",
          calDescription: calendarData.description,
          calLocation: calendarData.location,
          calEventType: calendarData.eventType,
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
      showToast("일정 등록 실패", "error");
      console.error("⛔ 일정 등록 실패:", e);
    }
  };

  // 모달 입력값 변경 핸들러
  const onChanges = (key, value) => {
    setCalendarData(prev => ({ ...prev, [key]: value }));
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

          {/* 캘린더 */}
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
              // console.log("📌 이벤트 title:", arg.event.title);
              const eventDate = arg.event.startStr.slice(0, 10); // YYYY-MM-DD
              const isNoHoliday = nonHolidayOffDates.includes(eventDate); // 쉬지 않는 공휴일이면 true
            
              return (
                <div style={{
                  color: isNoHoliday ? "#555" : "red", // 쉬지 않으면 검정, 쉬면 빨강
                  fontSize: "10px",
                  fontWeight: "bold",
                  paddingTop: "2px",
                  wordBreak: "break-word",       // ✅ 단어 기준으로 줄바꿈
                  whiteSpace: "normal",          // ✅ 한 줄 제한 해제
                  lineHeight: "1.2",
                  // overflow: "hidden",
                  // textOverflow: "ellipsis",
                  // whiteSpace: "nowrap",
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
      </div>

      {/* 일정 추가 모달 */}
      <Modal model={model} open={modalOpen} onClose={() => setModalOpen(false)} backdrop={false}>
        <Modal.Header>
          <Modal.Title>{"일정 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={onChanges} formValue={calendarData}>
            <Form.Group><Form.Control name="cal_title" placeholder="제목 입력" /></Form.Group>
            <Form.Group>
              <Form.ControlLabel>시작 ~ 종료</Form.ControlLabel>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control name="cal_start_date" type="datetime-local" disabled={calendarData.cal_all_day}/>
                <Form.Control name="cal_end_date" type="datetime-local" disabled={calendarData.cal_all_day}/>
              </div>
            </Form.Group>
            <Form.Group>
              <div onClick={() => setCalendarData(prev => ({ ...prev, cal_all_day: !prev.cal_all_day }))}
                style={{
                  backgroundColor: calendarData.cal_all_day ? "rgb(34, 40, 76)" : "#f5f5f5",
                  color: calendarData.cal_all_day ? "#fff" : "#333",
                }}
                className="all_day">
                {calendarData.cal_all_day ? "종일" : "시간 지정"}
              </div>
            </Form.Group>
            <Form.Group><Form.Control name="cal_location" placeholder="장소 입력" /></Form.Group>
            <Form.Group><Form.Control name="cal_event_type" placeholder="유형 (ex. 휴가)" /></Form.Group>
            <Form.Group><Form.Control name="cal_description" placeholder="설명 입력" /></Form.Group>

            <Btn text="등록" appearance="primary" size="sm" style={{ backgroundColor: "rgb(34, 40, 76)" }} onClick={()=>{addEvent}} />
          </Form>
        </Modal.Body>
      </Modal>
        {/* <Modal.Header><Modal.Title>{newEventDate || "일정 등록"}</Modal.Title></Modal.Header>
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
      </Modal> */}
    </>
  );
}
