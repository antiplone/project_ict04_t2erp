/* eslint-disable react/react-in-jsx-scope */
import MessageBox from "#components/common/MessageBox";
import { Container } from "rsuite";
import CurrentDateTime from "#components/attendance/CurrentDateTime";
import TodayCommuteInfo from "#components/attendance/TodayCommuteInfo";
import CommuteTable from "#components/attendance/CommuteTable";
import { useState } from "react";
import AppConfig from "#config/AppConfig.json";

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
  const raw_id = localStorage.getItem("e_id");
  const e_id = raw_id && !isNaN(Number(raw_id)) ? Number(raw_id) : null;
  const e_name = localStorage.getItem("e_name") || null;  // 사원명도 세션에서 불러옴

  console.log("📌 Management - e_id:", e_id);
  console.log("📌 Management - e_name:", e_name);


  return (
    <Container>
      <MessageBox text="근태관리" />
      <CurrentDateTime />
      <TodayCommuteInfo e_id={e_id} e_name={e_name} attURL={attURL} onRefresh={toggleRefresh} />
      <CommuteTable e_id={e_id} data={record} loading={loading} attURL={attURL} refresh={refresh} />
    </Container>
  );
}
