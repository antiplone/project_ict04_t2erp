/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState } from "react";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "@fullcalendar/core/locales/ko";
import "#styles/holiday.css";

import AppConfig from "#config/AppConfig.json";
import { Button, Form, Modal } from "rsuite";


export default function HolidayCalendar() {
  const fetchURL = AppConfig.fetch['mytest'];
  const calendarURL = `${fetchURL.protocol}${fetchURL.url}/api/calendar`;

  const calendarRef = useRef(); // FullCalendar에 직접 접근하기 위한 레퍼런스
  // 현재 화면에 보이는 달(년·월) 정보를 담고, 헤더에 출력하거나 버튼 클릭 시 업데이트한다.
  const [calendarDate, setCalendarDate] = useState(new Date());
  // API 응답으로 받아올 공휴일 이벤트 리스트({ title, start, allDay })를 저장한다.
  const [holidays, setHolidays] = useState([]);

  // 모달용 상태들
  const [modalOpen, setModalOpen] = useState(false);     // 모달
  const [newEventDate, setNewEventDate] = useState("");  // 클릭한 날짜
  const [newTitle, setNewTitle] = useState("");          // 입력할 제목

  // ✅ [1] 함수 위치 수정: 내부로 이동
  const clickMove = (type) => {
    const calendarApi = calendarRef.current.getApi();
    if (type === "prev") calendarApi.prev();
    if (type === "next") calendarApi.next();
    if (type === "today") calendarApi.today();

    setCalendarDate(new Date(calendarApi.getDate()));
  };

  // ✅ [2] 일정 추가 함수도 내부로
  const addEvent = () => {
    if (!newTitle.trim()) return;

    setHolidays(prev => [
      ...prev,
      {
        title: newTitle,
        start: newEventDate,
        allDay: true,
      }
    ]);

    setModalOpen(false);
    setNewTitle("");
  };

  // 1년치 공휴일 API 호출
  useEffect(() => {
    // 현재 연도를 기준으로 1월~12월까지 공휴일 데이터를 비동기로 한꺼번에 요청
    const year = calendarDate.getFullYear();
    Promise.all(
      Array.from({ length: 12 }, (_, i) => {
        const m = String(i + 1).padStart(2, "0");
        return fetch(`${calendarURL}/getEvents?year=${year}&month=${m}`)
          .then(res => res.json());
      })
    ).then(results => {
      const allHolidays = results.flat(); // 요청해서 응답받은 dto 객체들을 .flat()으로 하나의 배열로 합침
      setHolidays(allHolidays);           // 합친 결과물을 달력에 표시
    });
  }, []); // 컴포넌트 마운트 시 단 한번만 실행한다.

  const dateClick = (info) => {
    console.log("날짜 클릭됨:", info.dateStr);
    setNewEventDate(info.dateStr);  // ex: "2025-04-28"
    setNewTitle(""); // 모달이 열릴 때마다, 이전 제목이 남아있으면 안되므로, 이전 제목 초기화 설정.
    setModalOpen(true);
  };
  
  return (
    <>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 🔹 커스텀 헤더 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}>
          {/* 왼쪽 빈 영역 (혹시 필요하면 버튼 추가 가능) */}
          <div style={{ width: "60px" }}></div>

          {/* 왼쪽: ← 2025년 4월 → */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => clickMove("prev")} className="calendar-arrow">←</button>
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              {calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월
            </span>
            <button onClick={() => clickMove("next")} className="calendar-arrow">→</button>
          </div>

          {/* 오른쪽: 오늘 버튼 */}
          <div style={{ width: "60px", textAlign: "right" }}>
            <button onClick={() => clickMove("today")} className="calendar-today">오늘</button>
          </div>
        </div>

        {/* 캘린더 */}
        <FullCalendar
          ref={calendarRef}
          // plugins={[dayGridPlugin]}
          initialView="dayGridMonth"  // 한 달 그리드 뷰
          locale="ko"                 // 한국어 설정
          headerToolbar={false}       // 기본 툴바 대신 커스텀 툴바를 사용
          events={holidays}           // 앞서 불러온 공휴일 배열을 주입
          height={"auto"}
          dateClick={(info) => dateClick(info)} // 날짜 클릭 이벤트
          plugins={[dayGridPlugin, interactionPlugin]}

          // 공휴일 이름
          eventContent={(arg) => {
            return (
              <div style={{color: "red", fontSize: "10px", fontWeight: "bold", paddingTop: "2px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>  {/* 글자가 셀을 넘지 않도록 옵션 설정 */}
                {arg.event.title}
              </div>
            );
          }}

          //
          eventDidMount={(info) => {
            const date = info.event.startStr;
            const dateCell = document.querySelector(`[data-date='${date}']`);
            if (dateCell) {
              const numberEl = dateCell.querySelector('.fc-daygrid-day-number');
              if (numberEl) {
                numberEl.style.setProperty("color", "red", "important");
                numberEl.style.fontWeight = "bold";
              }
            }
          }}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>일정 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>날짜</Form.ControlLabel>
              <Form.Control readOnly plaintext defaultValue={newEventDate} />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>제목</Form.ControlLabel>
              <Form.Control
                name="title"
                value={newTitle}
                defaultValue={newEventDate}
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
