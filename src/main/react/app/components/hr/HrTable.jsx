/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Checkbox, Table } from 'rsuite';

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
        <Column
          key={index}
          minWidth={col.minWidth || 100}
          flexGrow={1}
          align="center"
          sortable
        >
          <HeaderCell>{col.label}</HeaderCell>
          <Cell dataKey={col.dataKey} />
        </Column>
      ))}

      <Column width={250} align="center">
        <HeaderCell>작업</HeaderCell>
        <Cell style={{ display: 'flex', alignContent: 'center' }}>
          {(rowData) =>
            renderActionButtons ? (
              renderActionButtons(rowData)
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

export const HrAppointTable = ({ items, selectedIds, onSelectChange, columns }) => {
  const handleRowCheck = (e_id) => {
    if (selectedIds.includes(e_id)) {
      onSelectChange(selectedIds.filter(id => id !== e_id));
    } else {
      onSelectChange([...selectedIds, e_id]);
    }
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      onSelectChange(items.map(emp => emp.e_id));
    } else {
      onSelectChange([]);
    }
  };

  const allChecked = selectedIds.length === items.length;
  const partiallyChecked = selectedIds.length > 0 && selectedIds.length < items.length;

  return (
    <Table
      autoHeight
      width={1050}
      data={items}
      cellBordered
      style={{ marginTop: '25px', marginBottom: '50px', border: '1px solid #EEEEEE'}}
    >
      <Column width={60} align="center">
        <HeaderCell>
          <Checkbox
            checked={allChecked}
            indeterminate={partiallyChecked}
            onChange={(value, checked) => handleCheckAll(checked)}
          />
        </HeaderCell>
        <Cell>
          {rowData => (
            <Checkbox
              checked={selectedIds.includes(rowData.e_id)}
              onChange={() => handleRowCheck(rowData.e_id)}
            />
          )}
        </Cell>
      </Column>

      {columns.map((col, index) => (
        <Column
          key={index}
          minWidth={col.minWidth || 100}
          flexGrow={1}
          align="center"
          sortable
        >
          <HeaderCell>{col.label}</HeaderCell>
          <Cell dataKey={col.dataKey} />
        </Column>
      ))}
    </Table>
  );
};

export const HrReadOnlyTable = ({ items, columns }) => {
  return (
    <Table
      autoHeight
      width={1050}
      data={items}
      cellBordered
      style={{ marginTop: '25px', marginBottom: '50px', border: '1px solid #EEEEEE' }}
    >
      {columns.map((col, index) => (
        <Column
          key={index}
          minWidth={col.minWidth || 100}
          flexGrow={1}
          align="center"
          sortable
        >
          <HeaderCell>{col.label}</HeaderCell>
          <Cell dataKey={col.dataKey} />
        </Column>
      ))}
    </Table>
  );
};
