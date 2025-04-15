import Btn from '#components/common/Btn.jsx';
import React from 'react'
import Tables_modifyAndDelete from './Btn_addModifyDelete';


const { Column, HeaderCell, Cell } = Table;

export default function Table({  }) {

  // cellBordered: 테이블에 가로선 생성
  return(
    <Table autoHeight cellBordered
      style={{ marginBottom: "24px" }}
      width={800}
      data={data ?? []}>
      {columns.map(col => (
        <Column key={col.dataKey} width={col.width} align="center">
          <HeaderCell>{col.label}</HeaderCell>
          <Cell dataKey={col.dataKey} />
        </Column>
      ))}

      <Tables_modifyAndDelete width="110" />
    </Table>
  )
}
