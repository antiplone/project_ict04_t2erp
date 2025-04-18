/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Button } from "rsuite";

export default function TodayCommuteInfo({ e_id, e_name, attURL, onRefresh }) {
  // onRefresh : 새로고침용 콜백함수
  console.log("🔥 현재 e_id:", e_id, ", e_name:", e_name);

  // 상태 관리
  const [record, setRecord] = useState(null);     // 출퇴근 데이터 객체
  const [loading, setLoading] = useState(true);   // 데이터 로딩 여부

  const fetchTodayRecord = () => {
    fetch(`${attURL}/todayRecord?e_id=${e_id}`)
      .then(res => res.json())
      .then(data => {
        setRecord(data);    // recode 상태에 저장
        setLoading(false);
      })
      .catch(err => {
        console.error("불러오기 실패:", err);
        setLoading(false);
      });
  };

  // 컴포넌트가 처음 렌더링될 때, 또는 e_id가 바뀔 때마다 실행됨
  // + 출근 기록 데이터를 최초로 불러옴
  useEffect(() => {
    if (!e_id || isNaN(e_id)) {
      console.warn("🚨 유효하지 않은 e_id. todayRecord fetch 생략됨.");
      return;
    }
    fetchTodayRecord();
  }, [e_id]);

  // 추가
  useEffect(() => {
    console.log("🧪 출퇴근 기록 상태:", record);
  }, [record]);

  // 출근 버튼을 누르면 처리되는 함수
  const startWork = async () => {
    try {
      const res = await fetch(`${attURL}/startTime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ e_id, e_name }),
      });
      alert(await res.text());
      onRefresh();          // 부모 쪽 UI 업데이트 유도
      fetchTodayRecord();   // 최신 출근시간 가져옴 → 버튼 disable 상태 업데이트됨
    } catch (err) {
      console.error("출근 에러:", err);
    }
  };

  // 퇴근 버튼을 누르면 처리되는 함수
  const endWork = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`${attURL}/endTime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ e_id, co_work_date: today }),
      });
      alert(await res.text());
      onRefresh();          // 테이블 갱신 요청
      fetchTodayRecord();   // 버튼 리프레쉬
    } catch (err) {
      console.error("퇴근 에러:", err);
    }
  };

  const hasStarted = !!record?.co_start_time; // 출근 시간 있으면 true
  const hasEnded = !!record?.co_end_time;     // 퇴근 시간 있으면 true

  return (
    <div style={{ marginTop: 20 }}>
      <h6>오늘의 출퇴근 정보</h6>
      <div>사원명: {record?.e_name || "-"}</div>
      <div>출근시간: {record?.co_start_time || "-"}</div>
      <div>퇴근시간: {record?.co_end_time || "-"}</div>

      {/* fetchTodayRecord()로 오늘 기록을 받아오기 전까지는 버튼이 렌더링x */}
      {/* {!loading && ( */}
        <div style={{ marginBottom: 10 }}>
          <Button appearance="primary" onClick={startWork} disabled={hasStarted} style={{ marginRight: 10 }}>
            출근
          </Button>
          <Button appearance="ghost" onClick={endWork} disabled={!hasStarted || hasEnded}>
            퇴근
          </Button>
        </div>
      {/* )} */}

    </div>
  );
}
