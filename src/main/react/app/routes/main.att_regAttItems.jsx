/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Container, Message, Button } from "rsuite";

import AttItemsTable from "#components/attendance/AttItemsTable";
import AttModal from "#components/attendance/AttModal";
import "#styles/attendance.css";


// 웹 페이지의 정보(메타데이터)를 설정해주는 함수. 즉, 웹페이지의 명함이라 할 수 있음.
export function meta() {
  return [
    { title: "근태 항목 등록" },  // title: html에서 쓰는 <title>내용</title> 과 같음
    { name: "description", content: "기본 항목 등록 - 근태 항목 등록 페이지" },
    // name, content: html에서 쓰는 <meta name="" content=""> 와 같음
  ];
}


// // Remix 에서는 loader 에서 JSON 데이터를 반환할 수 있다.
// export const loader = async () => {
//   const res = await fetch("http://localhost:8081/attendance/regAttItems");
//   const data = await res.json();
//   return data;
// };


// @Remix:url(/main/att_regAttItems)
export default function Att_regAttItems() {

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
    fetch("http://localhost:8081/attendance/regAttItems")
      .then(res => res.json())
      .then(data => setAttData(data));
  }, []);


  return (
    <Container>
      <Message type="info" bordered className="main_title">근태항목등록</Message>

      <Container className="tbl">
        <AttItemsTable
          url={`http://localhost:8081/attendance/regAttItems`}
          data={attData}
          columns={attColumns}
          onReloading={() => fetcher.load("/main/att_regAttItems")}
        />
        <Button className="btn" onClick={() => setModalOpen(true)}>추가</Button>
      </Container>
      
      <AttModal open={modalOpen} onClose={() => setModalOpen(false)} 
        onReloading={() => {
          fetcher.load("/main/att_regAttItems");
          setModalOpen(false);
        }} />
    </Container>
  );
}
