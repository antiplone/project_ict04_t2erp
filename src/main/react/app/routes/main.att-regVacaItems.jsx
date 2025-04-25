/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Container, Button } from "rsuite";

import VacaItemsTable from "#components/attendance/VacaItemsTable";
import VacaModal from "#components/attendance/VacaModal";
import MessageBox from "#components/common/MessageBox";
import "#styles/attendance.css";
import AppConfig from "#config/AppConfig.json";

export function meta() {
  return [
      { title: `${AppConfig.meta.title} : 휴가항목등록` },
      { name: "description", content: "휴가항목 페이지" },
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
  const vacaColumns = [
    { label: "휴가코드", dataKey: "v_code", width: 100 },
    { label: "휴가명", dataKey: "v_name", width: 150 },
    { label: "시작", dataKey: "v_start", width: 120 },
    { label: "끝", dataKey: "v_end", width: 120 },
    { label: "사용유무", dataKey: "v_use", width: 70 },
    { label: "비고", dataKey: "v_note", width: 230 },
  ];

  // 데이터 로딩 & 리로딩 처리
  // 처음 렌더링(서버로부터 HTML 파일을 받아 브라우저에 뿌리는 과정)되면 이곳을 호출해서 데이터를 로딩한다.
  useEffect(() => {
    fetch(`${attURL}/regVacaItems`)
      .then(res => res.json())
      .then(data => setAttData(data));
  }, []);


  return (
    <Container>
      <MessageBox text="휴가항목등록" />

      <Container className="tbl">
        <VacaItemsTable
          url={`${attURL}/regVacaItems`}
          data={attData}
          columns={vacaColumns}
          onReloading={() => fetcher.load("/main/att-regVacaItems")}
        />
        <Button className="btn" onClick={() => setModalOpen(true)}>추가</Button>
      </Container>
      
      <VacaModal open={modalOpen} onClose={() => setModalOpen(false)} 
        onReloading={() => {
          fetcher.load("/main/att-regVacaItems");
          setModalOpen(false);
        }} />
        {/* onReloading : 모달 내부에서 등록/수정 작업이 끝났을 때 실행하는 콜백 함수이다.
          새로고침 없이 목록을 다시 리로드시킨다. */}
    </Container>
  );
}
