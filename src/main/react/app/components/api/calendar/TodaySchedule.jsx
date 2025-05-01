/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import { Card, Form, Modal, Button } from "rsuite";
import Btn from "#components/attendance/Btn.jsx";
import AppConfig from "#config/AppConfig.json";
import "#styles/holiday.css";
import { useToast } from '#components/common/ToastProvider';

export default function TodaySchedule({ userEvents, todaySche, onAdd }) {
  const calendarURL = `${AppConfig.fetch.mytest.protocol}${AppConfig.fetch.mytest.url}/api/calendar`;
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태
  const [calendarData, setCalendarData] = useState({
    cal_title: "", cal_start_date: "", cal_end_date: "", cal_all_day: true,
    cal_location: "", cal_event_type: "", cal_description: "",
  });

  const storedID = Number(localStorage.getItem("e_id"));

  const changeForm = (value) => setCalendarData(value);

  const scheduleSave = async () => {
    try {
      const res = await fetch(`${calendarURL}/insertEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // DB는 스네이크케이스이고, 서버는 카멜케이스이기 때문에 DTO 필드에 맞게 매핑
          calTitle: calendarData.cal_title,
          calStartDate: calendarData.cal_start_date,
          calEndDate: calendarData.cal_end_date,
          calAllDay: calendarData.cal_all_day ? "Y" : "N",
          calLocation: calendarData.cal_location,
          calEventType: calendarData.cal_event_type,
          calDescription: calendarData.cal_description,
          eId: storedID
        })
      });

      // 캘린더 데이터 확인
      // console.log("보내는 일정 데이터: ", {
      //   calTitle: calendarData.cal_title,
      //   calStartDate: calendarData.cal_start_date,
      //   calEndDate: calendarData.cal_end_date,
      //   calAllDay: calendarData.cal_all_day,
      //   calLocation: calendarData.cal_location,
      //   calEventType: calendarData.cal_event_type,
      //   calDescription: calendarData.cal_description,
      //   eId: storedID
      // })

      if (res.ok) {
        showToast("일정이 등록되었습니다.", "success");
        setCalendarData({ cal_title: "", cal_start_date: "", cal_end_date: "", cal_all_day: true, cal_location: "", cal_event_type: "", cal_description: "" });
        onAdd && onAdd();
        setIsModalOpen(false);
      } else showToast("일정 등록 실패", "error");
    } catch (error) {
      console.error("⛔ 일정 등록 오류:", error);
    }
  };

  const dayFilter = todaySche
  ? userEvents.filter(event => {
      const dateStr = new Date(event.start).toISOString().slice(0, 10);
      return dateStr === todaySche;
    })
  : [];

  // 날짜 형식 함수로 따로 분리함
  const formatTime = (value) => {
    if (!value) return "";
    return typeof value === "string"
      ? value.slice(11, 16)
      : value.toISOString().slice(11, 16);
  };
  
  return (
    <>
      <Card style={{ width: "100%", minHeight: "300px" }}>
        <div className="today_schedule_title">
          <h5>오늘 일정 ({todaySche || "날짜 선택"})</h5>
          <Btn text="일정 추가" onClick={() => setIsModalOpen(true)} />
        </div>

        {dayFilter.length === 0 ? (
          <div className="no_schedule">오늘 등록된 일정이 없습니다.</div>
        ) : (
          <ul className="yes_schedule">
            {dayFilter.map((event, idx) => (
              <li key={idx}>
                <strong>{event.title}</strong><br />
                {event.allDay ? "종일" : `${formatTime(event.start)} ~ ${formatTime(event.end)}`}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header><Modal.Title>{todaySche || "일정 등록"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form fluid onChange={changeForm} formValue={calendarData}>
            <Form.Group><Form.Control name="cal_title" placeholder="제목 입력" /></Form.Group>
            <Form.Group>
              <Form.ControlLabel>시작 ~ 종료</Form.ControlLabel>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control name="cal_start_date" type="datetime-local" />
                <Form.Control name="cal_end_date" type="datetime-local" />
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

            <Btn text="등록" appearance="primary" size="sm" style={{ backgroundColor: "rgb(34, 40, 76)" }} onClick={scheduleSave} />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
