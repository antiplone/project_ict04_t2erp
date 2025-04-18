/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Table } from "rsuite";
import { useState, useEffect } from "react";
import CommuteUpdateModal from "./CommuteUpdateModal";
const { Column, HeaderCell, Cell } = Table;

export default function CommuteTable({ loading, attURL, refresh }) {
  const [record, setRecord] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // 1. 최초 렌더링 시 fetch 실행
  useEffect(() => {
    fetch(`${attURL}/attList`)
      .then((res) => res.json())
      .then((data) => {
        setRecord(data);
      })
      .catch((err) => {
        console.error("불러오기 실패:", err);
        setRecord([]);
      });
  }, [attURL, refresh]);  // URL이 바뀌면 다시 fetch

  // 2. 테이블 컬럼 정의
  const attColumns = [
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
      <Table autoHeight data={record} cellBordered width={840}>
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
      <CommuteUpdateModal open={modalOpen} onClose={() => setModalOpen(false)}
        attURL={attURL} onRefresh={() => refresh && refresh()}/>
    </>
  );
}
