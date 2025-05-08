/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useRef, useState } from "react";
import { Card, Form, Modal, Schema } from "rsuite";
import Btn from "#components/attendance/Btn.jsx";
import AppConfig from "#config/AppConfig.json";
import "#styles/holiday.css";
import { useToast } from '#components/common/ToastProvider';

const { StringType } = Schema.Types;

// Schema
const model = Schema.Model({
  cal_title: StringType()
    .isRequired("제목을 입력해주세요")
    .minLength(2, "2글자 이상 입력해주세요")
    .maxLength(100, "100자 이내로 작성해주세요"),
  
    cal_start_date: StringType()
    .isRequired("시작 날짜 및 시간을 선택해주세요")
});

export default function TodaySchedule({ userEvents, todaySche, onAdd }) {
  const fetchURL = AppConfig.fetch['mytest'];
  const calendarURL = `${fetchURL.protocol}${fetchURL.url}/api/calendar`;
  const { showToast } = useToast();
  const storedID = Number(localStorage.getItem("e_id"));
  const storedName = localStorage.getItem("e_name");
  const storedPosition = localStorage.getItem("e_position");
	const adminPositions = ["과장", "부장", "차장", "팀장", "이사", "관리"];

  const formRef = useRef();  // 폼 레퍼런스 선언

  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태
  const [calendarData, setCalendarData] = useState({
    cal_title: "", cal_start_date: "", cal_end_date: "", cal_all_day: false,
    cal_location: "", cal_event_type: "", cal_description: "",
  });

  // 수정 모달용 state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // 시작/종료 날짜 및 시간
  function toDatetimeLocal(date) {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }
  
  // 현재시간 생성 함수
  const getNow = () => {
    const now = new Date().toLocaleString("sv-SE", {timeZone: "Asia/Seoul"}).replace(" ","T");
    return now; // 'YYYY-MM-DDTHH:mm' 형식
  };
  
  const changeForm = (value) => setCalendarData(value);

  const scheduleSave = async () => {
    try {
      const res = await fetch(`${calendarURL}/insertEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // DB는 스네이크케이스이고, 서버는 카멜케이스이기 때문에 DTO 필드에 맞게 매핑
          calEventId: calendarData.cal_event_id,
          calTitle: calendarData.cal_title,
          calStartDate: calendarData.cal_start_date,
          calEndDate: calendarData.cal_end_date || null,
          calAllDay: calendarData.cal_all_day ? "Y" : "N",
          calLocation: calendarData.cal_location,
          calEventType: calendarData.cal_event_type,
          calDescription: calendarData.cal_description,
          eId: storedID,
          e_name: storedName,
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
      console.error("일정 등록 오류:", error);
    }
  };

  const dayFilter = todaySche && Array.isArray(userEvents)
  ? userEvents.filter(event => {
    if (!event?.start) return false;
    const dateStr = new Date(event.start).toLocaleDateString("sv-SE", {timeZone: "Asia/Seoul"}).replace(" ","T");
    return dateStr === todaySche;
  })
  : [];

  // 중복 제거
  const filteredEvents = [];
  const seen = new Set();
  dayFilter.forEach(event => {
    const key = `${event.title}-${event.start}`;
    if (!seen.has(key)) {
      seen.add(key);
      filteredEvents.push(event);
    }
  });

  // 날짜 형식 함수로 따로 분리함
  const formatTime = (value) => {
    if (!value) return "";
    
    return typeof value === "string"
      ? value.slice(11, 16)
      : value.toISOString().slice(11, 16);
  };

  // 일정 수정
  const updateSchedule = async (data) => {
    if (!data?.cal_event_id) {
      showToast("수정할 일정 ID가 없습니다.", "error");
      return;
    }

    try {
      const res = await fetch(`${calendarURL}/updateEvent/${data.cal_event_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calEventId: data.cal_event_id,
          calTitle: data.cal_title,
          calStartDate: data.cal_start_date,
          calEndDate: data.cal_all_day
            ? data.cal_start_date
            : data.cal_end_date,
          calAllDay: data.cal_all_day ? "Y" : "N",
          calLocation: data.cal_location,
          calEventType: data.cal_event_type,
          calDescription: data.cal_description,
          eId: storedID,
        }),
      });
  
      const result = await res.text();
      if (result === "1") {
        showToast("일정이 수정되었습니다.", "success");
        setEditModalOpen(false);
        onAdd && onAdd();
      } else {
        showToast("수정 실패", "error");
        console.error("캘린더 아이디:", cal_event_id);
      }
    } catch (error) {
      console.error("수정 중 오류:", error);
      showToast("수정 요청 중 오류 발생", "error");
    }
  };

  // 일정 삭제
  const deleteSchedule = async (calEventId) => {
    // console.log("캘린더 아이디 확인: ", calEventId);
    
    if (!calEventId) {
      showToast("삭제할 일정 ID가 존재하지 않습니다.", "error");
      return;
    }
    
    const cal_event_id = Number(calEventId);
    if (isNaN(cal_event_id)) {
      showToast("잘못된 일정 ID입니다.", "error");
      console.log("캘린더 아이디 확인: ", cal_event_id);
      return;
    }

    try {
      const res = await fetch(`${calendarURL}/deleteEvent/${cal_event_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("네트워크 오류");

      const result = await res.text();
      if (result === "1")  {
        showToast("일정이 삭제되었습니다.", "success");
        onAdd && onAdd(); // 삭제 후 일정 다시 불러오기
      } else {
        showToast("일정 삭제 실패", "error");
      }
    } catch (error) {
      console.error("삭제 중 오류:", error);
      showToast(`삭제 요청 중 오류가 발생했습니다.`, "error");
    }
  };
  
  return (
    <>
      <Card style={{ width: "100%", minHeight: "300px", padding: 20 }}>
        <div className="today_schedule_title">
          <h6>오늘의 일정 ({todaySche || "날짜 선택"})</h6>
          
          {/* 관리자급 직위 이상만 추가가 가능함 */}
          {adminPositions.includes(storedPosition?.trim()) ? (
          <Btn text="일정 추가" onClick={() => setIsModalOpen(true)} />
          ) : null}
        </div>

        {dayFilter.length === 0 ? (
          <div className="no_schedule">오늘 등록된 일정이 없습니다.</div>
        ) : (
          <>
            <ul className="yes_schedule">
              {filteredEvents.map((event, idx) => {
                const isHoliday = event.isHoliday === "Y";    // 공휴일인지 아닌지
                const titleColor = isHoliday ? "red" : "#111";
                return (
                  <li key={idx} style={{ marginBottom: 10 }}>
                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong style={{ color: titleColor }}>• {event.title}</strong>
                      
                      {/* 관리자급 직위 이상만 수정/삭제 가능함 */}
							        {adminPositions.includes(storedPosition?.trim()) ? (
                      <span>
                        <Btn text="수정" style={{ marginRight: 5 }} onClick={() => {
                          setEditData({
                            cal_title: event.title,
                            cal_start_date: toDatetimeLocal(event.start),
                            cal_end_date: event.end ? toDatetimeLocal(event.end) : "",  // null체크
                            cal_all_day: event.allDay,
                            cal_location: event.location || "",
                            cal_event_type: event.eventType || "",
                            cal_description: event.description || "",
                            cal_event_id: event.id,
                            eId: storedID        // 현재 로그인한 사번
                          });
                          setEditModalOpen(true);
                        }}
                          />
                        <Btn text="삭제" color="red" onClick={() => deleteSchedule(event.id)}/>
                      </span>
                    ) : null}
                    </span>
                    <span style={{ fontSize: 13 }}>
                      {event.allDay ? "종일" : `${formatTime(event.start)} ~ ${formatTime(event.end)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} backdrop={false}>
        <Modal.Header>
        <Modal.Title>일정 등록 <span style={{ fontSize:14 }}>{todaySche}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form model={model} ref={formRef} fluid onChange={changeForm} formValue={calendarData}>
            <Form.Group>
              <Form.Control name="cal_title" placeholder="제목 입력" />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>시작 ~ 종료</Form.ControlLabel>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control name="cal_start_date" type="datetime-local" />
                <Form.Control name="cal_end_date" type="datetime-local" />
              </div>
            </Form.Group>
            <Form.Group>
              <div onClick={() =>
                  setCalendarData((prev) => {
                    const toggled = !prev.cal_all_day;
                    
                    return {
                      ...prev,
                      cal_all_day: toggled,
                      // 종일로 바뀌는 순간, 시작시간을 현재로 자동 세팅
                      ...(toggled && !prev.cal_start_date
                        ? { cal_start_date: getNow() }
                        : {}),
                    };
                  })}
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
            <Btn text="등록" appearance="primary" size="sm" style={{ backgroundColor: "rgb(34, 40, 76)" }} onClick={scheduleSave}/>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 수정용 모달 */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} backdrop={false}>
        <Modal.Header>
          <Modal.Title>일정 수정 <span style={{ fontSize:14 }}>{todaySche}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form model={model} fluid formValue={editData} onChange={setEditData}>
            <Form.Group>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: 10 }}>작성자</div>
                <div style={{ padding: "5px 0", color: "#555", marginRight: 5 }}>{storedName}</div>
                <div style={{ padding: "5px 0", color: "#555" }}>{storedPosition}님</div>
              </div>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>제목</Form.ControlLabel>
              <Form.Control name="cal_title" placeholder="제목 입력" />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>시작 ~ 종료</Form.ControlLabel>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control
                  name="cal_start_date"
                  type="datetime-local"
                  value={editData?.cal_start_date}
                  onChange={(value) =>
                    setEditData((prev) => ({
                      ...prev,
                      cal_start_date: value,
                      ...(prev.cal_all_day ? { cal_end_date: value } : {}), // 종일이면 종료일도 맞춤
                    }))
                  }
                />
                <Form.Control
                  name="cal_end_date"
                  type="datetime-local"
                  value={editData?.cal_all_day ? editData?.cal_start_date : editData?.cal_end_date || ""}
                  disabled={editData?.cal_all_day} // 종일이면 비활성화
                  onChange={(value) =>
                    setEditData((prev) => ({
                      ...prev,
                      cal_end_date: value,
                    }))
                  }
                />
              </div>
            </Form.Group>

            <Form.Group>
              <div
                onClick={() =>
                  setEditData((prev) => {
                    const toggled = !prev.cal_all_day;
                    return {
                      ...prev,
                      cal_all_day: toggled,
                      cal_end_date: toggled ? prev.cal_start_date : "", // 종일이면 시작 = 종료
                    };
                  })
                }
                
                style={{
                  backgroundColor: editData?.cal_all_day ? "rgb(34, 40, 76)" : "#f5f5f5",
                  color: editData?.cal_all_day ? "#fff" : "#333",
                }}
                className="all_day"
              >
                {editData?.cal_all_day ? "종일" : "시간 지정"}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Control name="cal_location" placeholder="장소 입력" />
            </Form.Group>

            <Form.Group>
              <Form.Control name="cal_event_type" placeholder="유형 (ex. 휴가)" />
            </Form.Group>

            <Form.Group>
              <Form.Control name="cal_description" placeholder="설명 입력" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Btn text="저장" onClick={() => updateSchedule(editData)} size="sm" />
          <Btn text="취소" onClick={() => setEditModalOpen(false)} size="sm" style={{ color: "grey", borderColor: "grey" }} />
        </Modal.Footer>
      </Modal>
    </>
  );
}
