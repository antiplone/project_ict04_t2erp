import React from "react";
import { Employee } from "#components/attendance/Employee";
import MessageBox from "#components/common/MessageBox";
import { Button, Modal, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;
let data = Employee();

// 근태관리 → 검색 버튼 → 선택한 값들 조회했을 때, 뜨는 페이지
export default function att_attendanceList() {
  return (
    <div className="attItems">
      <MessageBox text="근태현황" />

      <Table autoHeight data={data}>
        <Column width={100} align="center">
          <HeaderCell>근태번호</HeaderCell>
          <Cell dataKey="e_regDate"></Cell>
        </Column>

        <Column width={100} align="center">
          <HeaderCell>사원명</HeaderCell>
          <Cell dataKey="e_name" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>근태코드</HeaderCell>
          <Cell dataKey="e_attCode" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>근태수</HeaderCell>
          <Cell dataKey="e_att" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>휴가명</HeaderCell>
          <Cell dataKey="e_attCode" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>비고</HeaderCell>
          <Cell dataKey="e_text" />
        </Column>
      </Table>
    </div>
  );
};
