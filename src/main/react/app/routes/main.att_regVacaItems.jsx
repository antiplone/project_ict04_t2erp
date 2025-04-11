/* eslint-disable react/react-in-jsx-scope */
import { Container, Message, Button } from "rsuite";

import VacaItemsTable from "#components/attendance/VacaItemsTable.jsx";
import VacaModal from "#components/attendance/VacaModal.jsx";
import "#styles/attendance.css";
import { useState } from "react";


// 웹 페이지의 정보(메타데이터)를 설정해주는 함수. 즉, 웹페이지의 명함이라 할 수 있음.
export function meta() {
  return [
    { title: "휴가 항목 등록" },
    { name: "description", content: "기본 항목 등록 - 휴가 항목 등록 페이지" },
  ];
}


// @Remix:url(/main/Att_regVacaItems)
export default function Att_regVacaItems() {

  // 테이블에 들어갈 항목들의 제목을 미리 정해둔다.
  const vacaColumns = [
    { label: "휴가코드", dataKey: "v_code", width: 100 },
    { label: "휴가명", dataKey: "v_name", width: 150 },
    { label: "휴가기간", dataKey: "v_period", width: 200 },
    { label: "사용유무", dataKey: "v_use", width: 70 },
    { label: "비고", dataKey: "v_note", width: 230 },
  ];

  // 모달 열고닫고의 상태변수
  const [modal, setModal] = useState(false);
  const openModal = () => { setModal(true); }     // 모달 열기
  const closeModal = () => { setModal(false); }   // 모달 닫기

  return (
    <Container>
      <Message type="info" bordered className="main_title">휴가항목등록</Message>
      <Container>
      <VacaItemsTable
        url={`http://localhost:8081/attendance/regVacaItems`}
        columns={vacaColumns}
      />
      <Button className="btn" onClick={openModal}>추가</Button>
    </Container>
      <VacaModal open={modal} onClose={closeModal} />
    </Container>
  );
}
