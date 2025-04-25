/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, SelectPicker, Table, Tabs } from "rsuite";
import { useState, useEffect } from "react";
import CommuteUpdateModal from "./CommuteUpdateModal";
import RetireInsertTable from "#components/hr/RetiInsertTable.jsx";
import AppConfig from "#config/AppConfig.json";
import "#styles/holiday.css";
const { Column, HeaderCell, Cell } = Table;


export default function CommuteTable({ loading, attURL, refresh, e_id }) {
  const fetchURL = AppConfig.fetch['mytest'];
  const hrURL = `${fetchURL.protocol}${fetchURL.url}/hr`;
  const hrCardURL = `${fetchURL.protocol}${fetchURL.url}/hrCard`;

  const [record, setRecord] = useState([]);
  const [myData, setMyData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [employee, setEmployee] = useState(null);   // 자식 컴포넌트를 위해 사원 정보 저장.


	// 로그인 시 저장해둔 사용자 직위를 가져오고, 관리자급 직위로만 다시 나누기
	const position = localStorage.getItem("e_position");  // 예: '관리자' 또는 '사원'
	const adminPositions = ["대리", "과장", "부장", "차장", "팀장", "이사", "관리"];

  // 중복 없이 날짜만 추출해서 리스트 만들기
  const uniqueDates = Array.from(new Set(record.map(item => item.co_work_date)));
  const [selectedDate, setSelectedDate] = useState("전체");
  const filteredRecord = selectedDate === "전체" ? record : record.filter(item => item.co_work_date === selectedDate);


  // 1. 최초 렌더링 시 fetch 실행
  useEffect(() => {

    // 전체 근태 현황
    fetch(`${attURL}/attList`)
    .then((res) => res.json())
    .then((data) => {
      setRecord(data);
    })
    .catch((err) => {
      console.error("불러오기 실패:", err);
      setRecord([]);
    });
      
    // 내 근태 현황
    fetch(`${attURL}/myAttList/${e_id}`)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      setMyData(data);
    })
    .catch((err) => {
      console.error("불러오기 실패:", err);
      setMyData([]);
    });
  }, [attURL, refresh]);  // URL이 바뀌면 다시 fetch


  // 자식 컴포넌트에 보낼 props 불러오기
  useEffect(() => {
    if (!e_id) return;
  
    fetch(`${hrCardURL}/hrCardDetail/${e_id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
      })
      .catch((err) => {
        console.error("사원 정보 로딩 실패:", err);
      });
  }, [e_id]);
  
  // 테이블 컬럼 정의
  const attColumns = [
    { label: "사원명", dataKey: "e_name", width: 100 },
    { label: "오늘날짜", dataKey: "co_work_date", width: 100 },
    { label: "출근시간", dataKey: "co_start_time", width: 100 },
    { label: "퇴근시간", dataKey: "co_end_time", width: 100 },
    { label: "근무시간", dataKey: "co_total_work_time", width: 100 },
    { label: "상태", dataKey: "co_status", width: 100 },
    { label: "상태비고", dataKey: "co_status_note", width: 240 },
  ];
  
  // 테이블 컬럼 정의
  const myAttColumns = [
    { label: "사원명", dataKey: "e_name", width: 100 },
    { label: "오늘날짜", dataKey: "co_work_date", width: 100 },
    { label: "출근시간", dataKey: "co_start_time", width: 100 },
    { label: "퇴근시간", dataKey: "co_end_time", width: 100 },
    { label: "근무시간", dataKey: "co_total_work_time", width: 100 },
    { label: "상태", dataKey: "co_status", width: 100 },
    { label: "상태비고", dataKey: "co_status_note", width: 240 },
  ];

  return (
    <>
      {/* 직위가 관리자급이면 퇴직 전체 조회, 그 외의 직위라면 본인의 신청 이력만 조회 가능 */}
      {adminPositions.includes(position?.trim()) ? ( // === : 값과 타입 모두 비교. position이 문자열일 때 .trim()을 적용
      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="전체 출퇴근 조회">
          <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px" }}>날짜 선택: </span>
            <SelectPicker
              data={[
                { label: "전체", value: "전체" },
                ...uniqueDates.map(date => ({ label: date, value: date }))
              ]}
              value={selectedDate}
              onChange={(value) => setSelectedDate(value)}
              style={{ width: 200 }}
              searchable={false}
              cleanable={false}
              placeholder="날짜 선택"
            />
          </div>

          <Table autoHeight data={filteredRecord} cellBordered width={910}>
            {attColumns.map((col) => (
              <Column key={col.dataKey} width={col.width} align="center">
                <HeaderCell>{col.label}</HeaderCell>
                <Cell dataKey={col.dataKey} />
              </Column>
            ))}
            <Column width={70} fixed="right" align="center">
              <HeaderCell>작업</HeaderCell>
              <Cell style={{ padding: '6px' }}>
                {rowData => (
                  <Button appearance="link"
                    onClick={() => { setSelectedRow(rowData); setModalOpen(true); }}>
                    수정
                  </Button>
                )}
              </Cell>
            </Column>
          </Table>
        </Tabs.Tab>

        <Tabs.Tab eventKey="2" title="내 출퇴근 조회">
          <Table autoHeight data={myData} cellBordered width={840}>
            {myAttColumns.map((col) => (
              <Column key={col.dataKey} width={col.width} align="center">
                <HeaderCell>{col.label}</HeaderCell>
                <Cell dataKey={col.dataKey} />
              </Column>
            ))}
            
            {/* <Column width={70} fixed="right" align="center">
              <HeaderCell>작업</HeaderCell>
              <Cell style={{ padding: '6px' }}>
                {rowData => (
                  <Button appearance="link"
                    onClick={() => { setSelectedRow(rowData); setModalOpen(true); }}>
                    정정 요청
                  </Button>
                )}
              </Cell>
            </Column> */}
          </Table>
        </Tabs.Tab>
        
        <Tabs.Tab eventKey="3" title="퇴직신청">
        {/* <RetireInsertTable /> */}
        {employee ? (
          <RetireInsertTable
            hrURL={hrURL}
            e_id={employee?.e_id}
            e_name={employee?.e_name}
            e_position={employee?.e_position}
            d_name={employee?.d_name}
          />
        ) : (
          <div style={{ padding: "20px" }}>사원 정보를 불러오는 중입니다...</div>
        )}
        </Tabs.Tab>
      </Tabs>
      ) : (e_id && (
      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="내 출퇴근 조회">
          <Table autoHeight data={myData} cellBordered width={840}>
            {myAttColumns.map((col) => (
              <Column key={col.dataKey} width={col.width} align="center">
                <HeaderCell>{col.label}</HeaderCell>
                <Cell dataKey={col.dataKey} />
              </Column>
            ))}
            
            {/* <Column width={70} fixed="right" align="center">
              <HeaderCell>작업</HeaderCell>
              <Cell style={{ padding: '6px' }}>
                {rowData => (
                  <Button appearance="link"
                    onClick={() => { setSelectedRow(rowData); setModalOpen(true); }}>
                    정정 요청
                  </Button>
                )}
              </Cell>
            </Column> */}
          </Table>
        </Tabs.Tab>
      
        <Tabs.Tab eventKey="2" title="퇴직신청">
        {/* <RetireInsertTable /> */}
        {employee ? (
          <RetireInsertTable
            hrURL={hrURL}
            e_id={employee?.e_id}
            e_name={employee?.e_name}
            e_position={employee?.e_position}
            d_name={employee?.d_name}
          />
        ) : (
          <div style={{ padding: "20px" }}>사원 정보를 불러오는 중입니다...</div>
        )}
        </Tabs.Tab>
      </Tabs>
    )
  )}
      <CommuteUpdateModal open={modalOpen} onClose={() => setModalOpen(false)}
        rowData={selectedRow} attURL={attURL} onRefresh={() => refresh && refresh()}/>
    </>
  );
}
