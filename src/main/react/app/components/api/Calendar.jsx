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

  // 캘린더의 상태 관리
  const calendarRef = useRef();   // FullCalendar 컴포넌트를 직접 조작할 수 있도록 참조를 저장하는 변수
  const [holidays, setHolidays] = useState([]);                 // 공휴일 정보를 저장
  const [calendarDate, setCalendarDate] = useState(new Date()); // 현재 보고 있는 달력을 기준으로 날짜를 저장
  const [userEvents, setUserEvents] = useState([]);             // 사용자가 추가한 일정을 저장

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);

  // 새 일정을 추가할 때 필요한 컬럼들을 저장
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

  // 버튼으로 월별 이동이 가능한 함수. type이라는 값을 받아서, 어떤 방향으로 이동할지 결정한다.
  const clickMove = (type) => {
    // calendarRef는 FullCalendar 컴포넌트를 직접 조작할 수 있도록 만든 도구이다. 얘를 안 쓰면 버튼을 누를 때, 직접 달력을 움직일 방법이 없다.
    // .current.getApi()를 호출하면 FullCalendar가 제공하는 조작할 수 있는 기능(메서드들)을 가져온다.
    const calendarApi = calendarRef.current.getApi();
    if (type === "prev") calendarApi.prev();
    if (type === "next") calendarApi.next();
    if (type === "today") calendarApi.today();
    setCalendarDate(new Date(calendarApi.getDate()));   // 이동이 끝난 다음, 현재 보이는 날짜를 다시 가져와서 calendarDate 상태에 저장한다.
  };

  // 구글 API로 1년치 공휴일 가져오기
  useEffect(() => {

    // 공휴일 불러오기(구글 캘린더 API)
    async function fetchHolidays() {
      try {
        const yearStart = `${calendarDate.getFullYear()}-01-01T00:00:00Z`;
        const yearEnd = `${calendarDate.getFullYear()}-12-31T23:59:59Z`;
  
        // timeMin과 timeMax로 1년치 공휴일을 요청한다.
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${yearStart}&timeMax=${yearEnd}&singleEvents=true&orderBy=startTime`;
  
        // 구글 API에 GET 요청을 보내고, 받은 응답을 JSON 형식으로 처리한다.
        const res = await fetch(url);
        const data = await res.json();
  
        // events: 구글 API 응답에서 공휴일 이벤트(data.items)를 반복하여 필요한 데이터만 추출
        const events = data.items.map(item => {
          const start = item.start.date;
          let end = item.end.date;
          if (end && end !== start) {
            const endDate = new Date(end);
            endDate.setDate(endDate.getDate() - 1);
            end = endDate.toISOString().slice(0, 10);
          }
  
          // 공휴일 제목에서 불필요한 단어인, "쉬는 날 " 텍스트를 제거
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
  
    // 서버에서 사용자 일정을 가져오는 함수
    async function fetchUserEvents() {
      try {
        const res = await fetch(`${calendarURL}/getAllEvents`);
        const data = await res.json();
  
        // 사용자 일정 데이터를 userEvents 상태에 저장하여 화면에 표시
        const events = data.map(item => ({
          title: item.calTitle,
          start: item.calStartDate,
          end: item.calEndDate,
          allDay: item.calAllDay === 'Y',
          description: item.calDescription,
          location: item.calLocation,
          eventType: item.calEventType,
          creacteAt: item.calCreatedAt,
          updateAt: item.calUpdatedAt,
        }));
  
        setUserEvents(events);
      } catch (error) {
        console.error("⛔ 사용자 일정 불러오기 실패:", error);
      }
    }
    fetchHolidays();    // 공휴일
    fetchUserEvents();  // 사용자일정
  }, [calendarDate]);   // 달 이동할 때마다 공휴일과 사용자 일정를 재조회

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

  // 새 일정 추가하는 함수
  const addEvent = async () => {
    if (!newTitle.trim()) return;   // 일정 제목이 없으면, 일정 추가x
  
    const startDateTime = startTime
      ? `${newEventDate}T${startTime}:00`   // 시:분 이니까 초(`:00`)도 붙여줌
      : `${newEventDate}T00:00:00`;         // 시작시간 없으면 00:00:00
  
    const endDateTime = endTime
      ? `${newEventDate}T${endTime}:00`
      : `${newEventDate}T00:00:00`;
  
    try {
      // 일정 정보를 서버에 전송 및 저장요청을 보냄
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
  
      // 서버가 요청을 성공적으로 처리했는지 확인하는 조건문
      if (response.ok) {
        console.log("✅ DB 저장 완료");   // 성공
  
        // 새 일정을 화면에 추가
        setUserEvents(prev => [
          ...prev,
          {
            title: newTitle,
            start: startDateTime,
            end: endDateTime,
            allDay: !startTime && !endTime,
          }
        ]);
        setModalOpen(false);    // 모달 닫기
      } else {                            // 실패
        console.error("⛔ 서버 저장 실패");
      }
    } catch (error) { // 만약 서버 요청 중에 오류가 발생하면 catch 구문에 의해 처리
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
          events={[...holidays, ...userEvents]} // 공휴일과 사용자 일정을 합쳐서 달력에 표시한 이벤트 목록을 설정
          height={"auto"}            // 높이 자동으로 설정
          plugins={[dayGridPlugin, interactionPlugin]}  // 일정 표시를 위한 플러그인과 사용자 상호작용(클릭 등)을 위한 플러그인을 설정
          dateClick={dateClick}      // 클릭 함수

          // 공휴일 날짜(휴일이라면 빨간색, 아니면 검정색)
          eventContent={(arg) => {
            const eventDate = arg.event.startStr.slice(0, 10); // YYYY-MM-DD
            const isNoHoliday = nonHolidayOffDates.includes(eventDate); // 쉬지 않는 공휴일이면 true
          
            return (
              <div style={{
                color: isNoHoliday ? "#555" : "red", // 쉬지 않으면 검정, 쉬면 빨강
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
