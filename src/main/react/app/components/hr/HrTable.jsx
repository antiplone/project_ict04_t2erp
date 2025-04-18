/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

export const HrTable = ({ items, columns, onEditClick, onDeleteClick, renderActionButtons }) => {
  return (
    <Table
      autoHeight
      width={1450}
      data={items}
      cellBordered
      style={{ marginTop: '25px', marginBottom: '50px', border: '1px solid #EEEEEE' }}
    >
      {columns.map((col, index) => (
        <Column key={index} width={col.width} align="center" sortable>
          <HeaderCell>{col.label}</HeaderCell>
          <Cell dataKey={col.dataKey} />
        </Column>
      ))}

      <Column width={250} align="center">
        <HeaderCell>작업</HeaderCell>
        <Cell style={{ display: 'flex', alignContent: 'center' }}>
          {(rowData) =>
            renderActionButtons ? (
              renderActionButtons(rowData) // 외부에서 원하는 버튼 구성 전달 전달하지 않으면 수정/삭제 버튼 나옴
            ) : (
              <>
                <Button
                  color="blue"
                  appearance="ghost"
                  size="xs"
                  style={{ marginRight: '5px' }}
                  onClick={() => onEditClick(rowData)}
                >
                  수정
                </Button>
                <Button
                  color="red"
                  appearance="ghost"
                  size="xs"
                  onClick={() => onDeleteClick(rowData.client_code || rowData.item_code)}
                >
                  삭제
                </Button>
              </>
            )
          }
        </Cell>
      </Column>
    </Table>
  );
};
