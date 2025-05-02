/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Container, Placeholder, Loader } from "rsuite";
import VacaItemsTable from "#components/attendance/VacaItemsTable";
import VacaModal from "#components/attendance/VacaModal";
import MessageBox from "#components/common/MessageBox";
import "#styles/attendance.css";
import AppConfig from "#config/AppConfig.json";
import Btn from "#components/attendance/Btn.jsx";

export function meta() {
  return [
      { title: `${AppConfig.meta.title} : 휴가항목등록` },
      { name: "description", content: "휴가항목 페이지" },
  ];
};

export default function RegVacaItems() {
  const fetchURL = AppConfig.fetch['mytest'];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;

  const [isLoading, setIsLoading] = useState(true);	  // 데이터를 가져오는 중인지 표시 (true/false)
  const [modalOpen, setModalOpen] = useState(false);  // 등록 버튼을 누르면 AttModal 을 보여줌.
  const [attData, setAttData] = useState([]);         // 근태값을 저장하는 상태 변수이다.

  // 테이블에 들어갈 항목들의 제목을 미리 정해둔다.
  const vacaColumns = [
    { label: "휴가코드", dataKey: "v_code", width: 100 },
    { label: "휴가명", dataKey: "v_name", width: 150 },
    { label: "시작", dataKey: "v_start", width: 120 },
    { label: "끝", dataKey: "v_end", width: 120 },
    { label: "사용유무", dataKey: "v_use", width: 70 },
    { label: "비고", dataKey: "v_note", width: 230 },
  ];

  // fetch로 데이터 불러오기 함수 정의
  const vacaData = async () => {
    try {
      const res = await fetch(`${attURL}/regVacaItems`);
      const data = await res.json();
      setAttData(data);
    } catch (err) {
      console.error("데이터 로딩 실패", err);
      setAttData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 처음 렌더링(서버로부터 HTML 파일을 받아 브라우저에 뿌리는 과정)되면 이곳을 호출해서 데이터를 로딩한다.
  useEffect(() => {
    vacaData();
  }, []);

  return (
    <Container>
      <MessageBox text="휴가항목등록" />

      <Container className="tbl">
        {/* 로딩 중일 때 */}
        {isLoading ? (
        <>
          <Placeholder.Paragraph rows={16} />
          <Loader center content="불러오는 중..." />
        </>
        ) : (
        <VacaItemsTable
          key={attData.length}  // 고유값 추가. 컴포넌트를 강제로 재마운트하기.
          data={attData}
          columns={vacaColumns}
          onReloading={vacaData}
        />
        )}
        <Btn text="추가" size="sm" style={{ width: 60 }} onClick={() => setModalOpen(true)} />
      </Container>
      
      <VacaModal open={modalOpen} onClose={() => setModalOpen(false)} 
        onReloading={() => {
          vacaData();
          setModalOpen(false);
        }} />
    </Container>
  );
}
