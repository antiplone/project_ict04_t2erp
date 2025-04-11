import React from 'react'
import { Table } from "rsuite";
import { Employee } from "#components/attendance/Employee";
import MessageBox from "#components/common/MessageBox";

const { Column, HeaderCell, Cell } = Table;
const data = Employee(); // 데이터 반환

export default function att_commuStatusList() {
  return(
    <div className="attItems">
      <MessageBox text="출/퇴근 현황(사원)" />

    <Table
        autoHeight
        data={data}
      >

        <Column width={120} align="center">
          <HeaderCell>일자</HeaderCell>
          <Cell dataKey="e_regDate" />
        </Column>

        <Column width={100} align="center" fixed>
          <HeaderCell>사원명</HeaderCell>
          <Cell dataKey="e_name" />
        </Column>

        <Column width={200} align="center">
          <HeaderCell>출근시간</HeaderCell>
          <Cell dataKey="e_attTime" />
        </Column>

        <Column width={200} align="center">
          <HeaderCell>퇴근시간</HeaderCell>
          <Cell dataKey="e_leaveTime" />
        </Column>
      </Table>
    </div>
   );
 }