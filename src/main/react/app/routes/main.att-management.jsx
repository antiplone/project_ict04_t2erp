/* eslint-disable react/react-in-jsx-scope */
import MessageBox from "#components/common/MessageBox";
import { Container } from "rsuite";
import TodayCommuteInfo from "#components/attendance/TodayCommuteInfo";
import CommuteTable from "#components/attendance/CommuteTable";
import { useState } from "react";
import AppConfig from "#config/AppConfig.json";
import "#styles/attendance.css";
import WeatherBox from "#components/api/WeatherBox.jsx";
import CurrentDateTime from "#components/attendance/CurrentDateTime.jsx";


export function meta() {
  return [
      { title: `${AppConfig.meta.title} : 출퇴근` },
      { name: "description", content: "출퇴근 페이지" },
  ];
};


export default function Management() {
  const fetchURL = AppConfig.fetch["mytest"];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;
  const [refresh, setRefresh] = useState(false);  // 공통 상태 끌어올리기

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleRefresh = () => setRefresh(prev => !prev); // true ↔ false 토글

  // const raw_id = sessionStorage.getItem("e_id");
  // const e_id = raw_id && !isNaN(Number(raw_id)) ? Number(raw_id) : null;
  // const e_name = sessionStorage.getItem("e_name") || null;  // 사원명도 세션에서 불러옴

  // e_id의 값을 문자열로 반환한다. 없으면 null을 반환한다.
  const raw_id = localStorage.getItem("e_id");

  // raw_id 값을 정수형으로 바꾸면서, 유효한 숫자인지 안전하게 확인하는 코드이다.
  // raw_id 이 그대로 문자열이거나 정수형 raw_id가 null이 아닌게 아니라면 true, 아니면 null을 반환한다.
  const e_id = raw_id && !isNaN(Number(raw_id)) ? Number(raw_id) : null;

  // 사원명도 세션에서 불러옴
  const e_name = localStorage.getItem("e_name") || null;

  console.log("📌 로그인 정보- e_id:", e_id, ", e_name:", e_name);  // 콘솔창에서 값 확인


  return (
    <Container>
      <MessageBox text="근태관리" />
        <CurrentDateTime />
        <TodayCommuteInfo
          e_id={e_id}
          e_name={e_name}
          attURL={attURL}
          onRefresh={toggleRefresh}
        />

        <CommuteTable
          e_id={e_id}
          data={record}
          loading={loading}
          attURL={attURL}
          refresh={refresh}
        />
    </Container>
  );
}

