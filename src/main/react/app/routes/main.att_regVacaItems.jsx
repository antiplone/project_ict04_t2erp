/* eslint-disable react/react-in-jsx-scope */
import { Container, Button } from "rsuite";
import { useState } from "react";
import VacaItemsTable from "#components/attendance/VacaItemsTable.jsx";
import VacaModal from "#components/attendance/VacaModal.jsx";
import "#styles/attendance.css";
import MessageBox from "#components/common/MessageBox";
import MetaBox from "#components/common/MetaBox";
import AppConfig from "#config/AppConfig.json";


<MetaBox title="휴가 항목 등록" content="기본 항목 등록 - 휴가 항목 등록 페이지" />

// @Remix:url(/main/Att_regVacaItems)
export default function Att_regVacaItems() {
  const fetchURL = AppConfig.fetch['mytest'];

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
      <MessageBox text="휴가항목등록" />

      <Container>
        <VacaItemsTable
          url={`${fetchURL.protocol}${fetchURL.url}/attendance/regVacaItems`}
          columns={vacaColumns}
        />
        <Button className="btn" onClick={openModal}>추가</Button>
      </Container>

      <VacaModal open={modal} onClose={closeModal} />
    </Container>
  );
}
