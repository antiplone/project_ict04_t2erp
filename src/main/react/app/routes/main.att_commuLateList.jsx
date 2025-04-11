import React from "react";
import { Table } from "rsuite";
import { EmployeeLate } from "#components/attendance/EmployeeLate";
import MessageBox from "#components/common/MessageBox";

const { Column, HeaderCell, Cell } = Table;
const data = EmployeeLate(); // 데이터 반환

export default function att_commuLateList() {
  return (
    <div className="attItems">
      <MessageBox text="지각현황(사원)" />

      <Table autoHeight data={data}>
        <Column width={100}>
          <HeaderCell>일자</HeaderCell>
          <Cell dataKey="e_regDate_late" />
        </Column>

        <Column width={80} fixed>
          <HeaderCell>사원명</HeaderCell>
          <Cell dataKey="e_name_late" />
        </Column>

        <Column width={200} align="center">
          <HeaderCell>출근시간</HeaderCell>
          <Cell dataKey="e_attTime" />
        </Column>

        <Column width={200} align="center">
          <HeaderCell>출근시간입력</HeaderCell>
          <Cell dataKey="e_attTime_late" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>출근적요</HeaderCell>
          <Cell dataKey="e_attTime_why" />
        </Column>
      </Table>
    </div>
  );
};
