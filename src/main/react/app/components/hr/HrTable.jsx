/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Checkbox, Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

export const HrTable = ({ items, columns, onEditClick, onDeleteClick, renderActionButtons }) => {
  return (
    <Table
      autoHeight
      virtualized={false}
      data={items}
      cellBordered
      style={{ marginTop: '25px', marginBottom: '50px', border: '1px solid #EEEEEE' }}
    >
      {columns.map((col, index) => {
  
  const isFlexible = ["c_note", "re_note", "sa_approval_comment"].includes(col.dataKey);  

  return (
    <Column
      key={col.dataKey}
      {...(isFlexible
        ? { flexGrow: 1 }        // 비고 컬럼은 남는 공간 다 가져가기
        : { width: col.width || 100 })} // 나머지는 width 고정
      align={col.align || "center"}
      fixed={index === 0 ? "left" : undefined}
    >
      <HeaderCell>{col.label || ""}</HeaderCell>
      <Cell>
        {(rowData, rowIndex) =>
          col.renderCell
            ? col.renderCell(rowData, rowIndex)
            : rowData[col.dataKey]
        }
      </Cell>
    </Column>
  );
})}

      <Column width={180} align="center" fixed="right">
        <HeaderCell>작업</HeaderCell>
        <Cell>
          {(rowData) => {
            if (renderActionButtons) {
              return renderActionButtons(rowData);
            } else {
              return (
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
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteClick(rowData);
                    }}
                  >
                    삭제
                  </Button>
                </>
              );
            }
          }}
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

export const EmployeeSelectTable = ({ data, selectedId, onSelect, selectedEmployeeIds = [] }) => {
  return (
    <Table autoHeight data={data} bordered cellBordered>      
      <Column width={63} align="center">
        <HeaderCell>선택</HeaderCell>
        <Cell style={{ display:'flex', alignContent: 'center' }}>
          {rowData => (
            <Checkbox
              checked={selectedId === rowData.e_id}
              disabled={selectedEmployeeIds.includes(rowData.e_id)}   // 이미 선택된 사원 비활성화
              onChange={() => onSelect(rowData.e_id)}
            />
          )}
        </Cell>
      </Column>

      <Column width={90}align="center">
        <HeaderCell>사번</HeaderCell>
        <Cell dataKey="e_id" />
      </Column>

      <Column width={130} align="center">
        <HeaderCell>이름</HeaderCell>
        <Cell dataKey="e_name" />
      </Column>

      <Column width={130} align="center">
        <HeaderCell>직급</HeaderCell>
        <Cell dataKey="e_position" />
      </Column>

      <Column width={130} align="center">
        <HeaderCell>부서</HeaderCell>
        <Cell dataKey="d_name" />
      </Column>
    </Table>
  );
};

const displayOrDash = (value) => (value ? value : '-');

export const HrAppointListTable = ({ items, columns, selectedIds, onSelect }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table
        autoHeight
        data={items}
        cellBordered
        style={{ width: '100%', minWidth: '1400px', marginTop: '25px', marginBottom: '50px', border: '1px solid #EEEEEE' }}
      >
        {/* 체크박스 고정 컬럼 추가 */}
        <Column width={60} align="center" fixed>
          <HeaderCell>선택</HeaderCell>
          
          <Cell>
            {(rowData) => (
              <div 
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedIds.includes(rowData.e_id)}
                  onChange={(value, checked) => {
                    if (checked) {
                      onSelect([rowData.e_id]);
                    } else {
                      onSelect([]);
                    }
                  }}
                />
              </div>
            )}
          </Cell>
        </Column>

        {/* 기존 컬럼들 */}
        {columns.map((col, index) => {
          const isFlexible = col.dataKey === 'appoint_note';

          return (
            <Column
              key={index}
              {...(isFlexible
                ? { flexGrow: 1, minWidth: col.width || 250 }
                : { width: col.width || 100 })}
              align="center"
            >
              <HeaderCell>{col.label}</HeaderCell>
              <Cell>
                {(rowData) => {
                  const value =
                    col.dataKey === 'appoint_date'
                      ? (rowData.appoint_date ? new Date(rowData.appoint_date).toISOString().slice(0, 10) : '-')
                      : (rowData[col.dataKey] || '-');

                  return isFlexible ? (
                    <div style={{ textAlign: 'left', width: '100%' }}>{value}</div>
                  ) : (
                    value
                  );
                }}
              </Cell>
            </Column>
          );
        })}
      </Table>

      
    </div>
  );
};




