/* eslint-disable react/react-in-jsx-scope */
import { Button, Container } from "rsuite";
import "#styles/attendance.css";
import { useEffect, useState } from "react";

export default function AttCommute() {    // 내 근태 현황
  const [currentTime, setCurrentTime] = useState(new Date());   // 현재 시간
  const [record, setRecord] = useState([]);

  // 하드코딩
  const e_id = Number(sessionStorage.getItem("e_id")); // 문자열 → 숫자 변환
  const e_name = sessionStorage.getItem("e_name");  // 사원명도 세션에서 불러옴

  // 년월일로 표시
  const todayFormatted = currentTime.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeFormatted = currentTime.toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Seoul",
  });

  // 실시간 시계
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);   // 1초마다 업데이트
    return () => clearInterval(timer);    // 언마운트 시 정리
  }, []);


  // 출근 등록
  const startWork = async () => {
    try {
      const res = await fetch(`${attURL}/startTime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ e_id, e_name }),
      });

      const text = await res.text();
      alert(text);    

      // 🔥 이 부분에서 문제가 있음 → 데이터는 서버에 반영됐는데
      // fetchTodayRecord()는 서버에서 아직 INSERT 반영 전인 상태를 읽을 수 있음
      // 그래서 약간의 지연시간 후 다시 fetch하는 게 안전함람쥐
      setTimeout(() => {
        fetchTodayRecord(); // ⏰ 0.3~0.5초 후 호출
      }, 500);
      

    } catch (err) {
      console.error("출근 에러:", err);
      alert("출근 등록 중 오류 발생!");
    }
  };

  // 퇴근 등록
  const endWork = async () => {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    try {
      const res = await fetch(`${attURL}/endTime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ e_id, co_work_date: today }),
      });

      const text = await res.text();
      alert(text);
      fetchTodayRecord();
    } catch (err) {
      console.error("퇴근 에러:", err);
      alert("퇴근 등록 중 오류 발생!");
    }
  };

  // 한 번은 돌리기
  useEffect(() => {
    fetchTodayRecord();
  }, []);

  const hasStarted = !!record?.co_start_time;
  const hasEnded = !!record?.co_end_time;

  return(
    <Container>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: 10 }}>
          {todayFormatted}
        </div>
        <div style={{ marginTop: 10 }}>{timeFormatted}</div>

        <div style={{ marginTop: 20 }} data={record}>
          <h6>오늘의 출퇴근 정보</h6>
          <div>사원명: {e_name}</div>

          {/* {loading ? (<div>로딩 중...</div>) : !record ? (<div>오늘 기록이 없습니다.</div>) : (
            <>
              <div>사원명: {record.e_name}</div>
              <div>출근시간: {record.co_start_time || "-"}</div>
              <div>퇴근시간: {record.co_end_time || "-"}</div>
              <div>근무시간: {record.co_total_work_time || "-"}</div>
              <div>상태: {record.co_status || "-"}</div>
              <div>비고: {record.co_status_note || "-"}</div>
            </>
          )} */}
        </div>
        
        <div style={{ marginBottom: 10 }}>
          <Button appearance="primary" onClick={startWork} style={{ marginRight: 10 }} disabled={hasStarted}>출근</Button>
          <Button appearance="ghost" onClick={endWork} disabled={!hasStarted || hasEnded}>퇴근</Button>
        </div>
      </div>
      {/* <div className="attContainer">
        <div>2025년 04월 13일(일)</div>
        <div className="attTitle">17:00:00</div>
        <div className="attText" style={{ marginTop: "18px" }}>
          <span>출근시간</span>
          <span>08:26:44</span>
        </div>
        <div className="attText">
          <span>퇴근시간</span>
          <span>미등록</span>
        </div>
        <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between" }}>
          <Button className="attBtns">출근하기</Button>
          <Button className="attBtns">퇴근하기</Button>
        </div>
      </div> */}
    </Container>
   )
}
