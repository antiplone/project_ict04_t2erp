import React from "react";
import { Table } from "rsuite";
import { Employee } from "#components/attendance/Employee";
import MessageBox from "#components/common/MessageBox";

const { Column, HeaderCell, Cell } = Table;
const data = Employee(); // 데이터 반환

export default function att_commuAttStatusList() {
  return (
    <div className="attItems">
      <MessageBox text="출퇴근/근태 현황(사원)" />

      <Table autoHeight data={data}>
        <Column width={120} sortable>
          <HeaderCell align="center">일자</HeaderCell>
          <Cell dataKey="e_regDate" />
        </Column>

        <Column width={80} fixed sortable>
          <HeaderCell>사원명</HeaderCell>
          <Cell dataKey="e_name" />
        </Column>

        <Column width={200} sortable>
          <HeaderCell>출근시간</HeaderCell>
          <Cell dataKey="e_attTime" />
        </Column>

        <Column width={200} sortable>
          <HeaderCell>퇴근시간</HeaderCell>
          <Cell dataKey="e_leaveTime" />
        </Column>

        <Column width={90} align="right" sortable>
          <HeaderCell>근태내역</HeaderCell>
          <Cell dataKey="e_att" />
        </Column>

        <Column width={200} align="center" sortable>
          <HeaderCell>적요</HeaderCell>
          <Cell dataKey="e_text" />
        </Column>
      </Table>
    </div>
  );
};
