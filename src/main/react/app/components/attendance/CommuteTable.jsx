/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Table, Tabs } from "rsuite";
import { useState, useEffect } from "react";
import CommuteUpdateModal from "./CommuteUpdateModal";
const { Column, HeaderCell, Cell } = Table;

export default function CommuteTable({ loading, attURL, refresh, e_id }) {
  const [record, setRecord] = useState([]);
  const [myData, setMyData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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
    .then((res) => res.json())
    .then((data) => {
      setMyData(data);
    })
    .catch((err) => {
      console.error("불러오기 실패:", err);
      setMyData([]);
    });
  }, [attURL, refresh]);  // URL이 바뀌면 다시 fetch


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
      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="전체">
          <Table autoHeight data={record} cellBordered width={910}>
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

        <Tabs.Tab eventKey="2" title="내 출퇴근 내역">
          <Table autoHeight data={myData} cellBordered width={840}>
            {myAttColumns.map((col) => (
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
                    정정 요청
                  </Button>
                )}
              </Cell>
            </Column>
          </Table>
        </Tabs.Tab>
      </Tabs>
      <CommuteUpdateModal open={modalOpen} onClose={() => setModalOpen(false)}
        rowData={selectedRow} attURL={attURL} onRefresh={() => refresh && refresh()}/>
    </>
  );
}
