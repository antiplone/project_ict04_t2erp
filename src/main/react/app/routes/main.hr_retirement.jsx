/* eslint-disable react/react-in-jsx-scope */
import Tables from "#components/attendance/Tables.jsx";
import MessageBox from "#components/common/MessageBox";
import { useState } from "react";
import { Container } from "rsuite";
import AppConfig from "#config/AppConfig.json";


export function meta() {
  return [
    { title: `${AppConfig.meta.title} : 인사관리` },
    { name: "description", content: "퇴직관리 페이지" },
  ];
};

export default function Hr_retirement() {
  const fetchURL = AppConfig.fetch['mytest'];
  
  const [resiData, setResiData] = useState([]); // 퇴사자 데이터를 저장하는 상태 변수.

  // 테이블에 들어갈 항목들의 제목을 미리 정해둔다.
  const resiColumns = [
    { label: "사원번호", dataKey: "e_id", width: 70 },
    { label: "사원명", dataKey: "e_name", width: 80 },
    { label: "부서", dataKey: "d_name", width: 100 },
    { label: "직위", dataKey: "e_position", width: 60 },
    { label: "퇴사유형", dataKey: "resi_type", width: 80 },
    { label: "퇴사신청일", dataKey: "resi_app_date", width: 100, render: rowData => new Date(rowData.resi_app_date).toLocaleDateString("ko-KR") },
    { label: "퇴사예정일", dataKey: "resi_date", width: 100 },
    { label: "승인상태", dataKey: "resi_approval_status", width: 80 },
    { label: "반려사유", dataKey: "resi_reasons", width: 180 },
    { label: "인수인계 여부", dataKey: "resi_succession_yn", width: 100 },
    { label: "비고", dataKey: "resi_note", width: 200 },
  ];

  return (
    <Container>
      <MessageBox text="퇴직 관리" />
      
      <Tables url={`${fetchURL.protocol}${fetchURL.url}/personnel/retirementList`} columns={resiColumns} data={resiData} />
    </Container>
  );
}
