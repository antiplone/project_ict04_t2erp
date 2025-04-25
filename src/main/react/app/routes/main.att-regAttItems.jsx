/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Container, Button } from "rsuite";

import AttItemsTable from "#components/attendance/AttItemsTable";
import AttModal from "#components/attendance/AttModal";
import MessageBox from "#components/common/MessageBox";
import "#styles/attendance.css";
import Btn from "#components/attendance/Btn.jsx";
import AppConfig from "#config/AppConfig.json";

export function meta() {
  return [
      { title: `${AppConfig.meta.title} : 근태항목등록` },
      { name: "description", content: "근태항목 페이지" },
  ];
};

export default function RegAttItems() {
  const fetchURL = AppConfig.fetch['mytest'];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;

  // 등록 버튼을 누르면 AttModal 을 보여줌.
  const [modalOpen, setModalOpen] = useState(false);

  // 테이블 데이터 로딩을 useFetcher() 로 관리함.
  const fetcher = useFetcher();

  // 근태값을 저장하는 상태 변수이다.
  const [attData, setAttData] = useState([]);

  // 테이블에 들어갈 항목들의 제목을 미리 정해둔다.
  const attColumns = [
    { label: "근태코드", dataKey: "a_code", width: 100 },
    { label: "근태명", dataKey: "a_name", width: 150 },
    { label: "근태유형", dataKey: "a_type", width: 100 },
    { label: "사용유무", dataKey: "a_use", width: 100 },
    { label: "비고", dataKey: "a_note", width: 240 },
  ];

  // 데이터 로딩 & 리로딩 처리
  // 처음 렌더링(서버로부터 HTML 파일을 받아 브라우저에 뿌리는 과정)되면 이곳을 호출해서 데이터를 로딩한다.
  useEffect(() => {
    fetch(`${attURL}/regAttItems`)
      .then(res => res.json())
      .then(data => setAttData(data));
  }, []);


  return (
    <Container>
      <MessageBox text="근태항목등록" />

      <Container className="tbl">
        <AttItemsTable
          url={`${attURL}/regAttItems`}
          data={attData}
          columns={attColumns}
          onReloading={() => fetcher.load("/main/att-regAttItems")}
        />
        <Btn text="추가" color="blue" onClick={() => setModalOpen(true)} />
      </Container>
      
      <AttModal open={modalOpen} onClose={() => setModalOpen(false)} 
        onReloading={() => {
          fetcher.load("/main/att-regAttItems");
          setModalOpen(false);
        }} />
    </Container>
  );
}
