/* eslint-disable react/prop-types */
import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from 'react';
import { Table, Input, DatePicker, SelectPicker, Modal, Button, CheckPicker } from 'rsuite';
import { EmployeeSelectTable } from './HrTable';

const { Column, HeaderCell, Cell } = Table;
const fetchURL = AppConfig.fetch['mytest'];

// 직급 리스트
const positionList = [
  { label: '사원', value: '사원' },
  { label: '대리', value: '대리' },
  { label: '과장', value: '과장' },
  { label: '차장', value: '차장' },
  { label: '부장', value: '부장' },
  { label: '이사', value: '이사' },
];

const EditableInput = ({ row, field, onChange, onDoubleClick }) => {
  const [localValue, setLocalValue] = useState(row[field] || '');

  useEffect(() => {
    setLocalValue(row[field] || '');
  }, [row[field]]); // 외부 데이터 바뀌면 동기화

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
      <Input
        value={localValue}
        onChange={(value) => setLocalValue(value)}
        onBlur={() => onChange(row.id, field, localValue)}
        onDoubleClick={onDoubleClick}
        style={{ height: '36px', width: '100%',  fontSize: '14px', padding: '4px 8px' }}
      />
    </div>
  );
};

const HrAppointEditTable = ({ rows, onChange, onDoubleClickCell, departmentList, setEmployees }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [targetRowId, setTargetRowId] = useState(null);

  // 사원 가져오기
  useEffect(() => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/hrCard/hrCardList`)
      .then(res => res.json())
      .then(data => setEmpList(data))
      .catch(err => console.error("사원 불러오기 실패:", err));
  }, []);

  const handleDoubleClick = (id) => {
    setTargetRowId(id);
    setModalOpen(true);
  };

  const handleConfirmModal = () => {
    if (selectedEmp && targetRowId !== null) {
      const selected = empList.find(emp => emp.e_id === selectedEmp);
      if (selected) {
        const updateFields = {
          id: targetRowId,
          e_id: selected.e_id,
          e_name: selected.e_name,
          old_position: selected.e_position,
          old_department: selected.d_name || ''
        };

        setEmployees(prev =>
          prev.map(row =>
            row.id === targetRowId
              ? { ...row, ...updateFields }
              : row
          )
        );
      } else {
        console.log('선택된 사원 못 찾음:', selectedEmp);
      }
    } else {
      console.log('선택된 사원 없음 or row 없음', selectedEmp, targetRowId);
    }

    setModalOpen(false);
    setSelectedEmp(null);
  };

  return (
    <>
      <Table autoHeight data={rows} cellBordered bordered 
        style={{
          marginTop: 20,
          width: '100%',    
          minWidth: '1400px' 
        }}>
        <Column width={130} align="center">
          <HeaderCell>사번</HeaderCell>
          <Cell>
            {row => (
              <EditableInput
                row={row}
                field="e_id"
                onChange={onChange}
                onDoubleClick={() => handleDoubleClick(row.id)}
              />
            )}
          </Cell>
        </Column>

        <Column width={140} align="center">
          <HeaderCell>이름</HeaderCell>
          <Cell>
            {row => (
              <EditableInput
                row={row}
                field="e_name"
                onChange={onChange}
              />
            )}
          </Cell>
        </Column>

        <Column width={140} align="center">
          <HeaderCell>현재 직급</HeaderCell>
          <Cell>
            {row => (
              <EditableInput
                row={row}
                field="old_position"
                onChange={onChange}
              />
            )}
          </Cell>
        </Column>

        <Column width={140} align="center">
          <HeaderCell>현재 부서</HeaderCell>
          <Cell>
            {row => (
              <EditableInput
                row={row}
                field="old_department"
                onChange={onChange}
              />
            )}
          </Cell>
        </Column>

        <Column width={180} align="center">
          <HeaderCell>발령 구분</HeaderCell>
          <Cell>
            {row => (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckPicker
                  placeholder="선택"
                  data={[
                    { label: '부서 이동', value: '부서 이동' },
                    { label: '직급 변경', value: '직급 변경' }
                  ]}
                  value={Array.isArray(row.appoint_type) ? row.appoint_type : []}
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      onChange(row.id, 'appoint_type', value);
                    } else {
                      onChange(row.id, 'appoint_type', value ? [value] : []);
                    }
                  }}
                  style={{ width: 160 }}
                  cleanable={false}
                  searchable={false}
                  toggleOnSelect={false}
                  popupAutoClose={false}
                  renderValue={(value, items, selectedElement) => value.join(', ')}
                />
              </div>
            )}
          </Cell>
        </Column>

        <Column width={150} align="center">
          <HeaderCell>발령 직급</HeaderCell>
          <Cell>
            {row => (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SelectPicker
                  placeholder="선택"
                  data={positionList}
                  value={row.new_position}
                  onChange={(value) => onChange(row.id, 'new_position', value)}
                  style={{ width: 120 }}
                  disabled={row.appoint_type === '부서 이동'}
                  searchable={false}
                />
              </div>
            )}
          </Cell>
        </Column>

        <Column width={150} align="center">
          <HeaderCell>발령 부서</HeaderCell>
          <Cell>
            {row => (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SelectPicker
                  placeholder="선택"
                  data={departmentList}
                  value={row.new_department}
                  onChange={(value) => onChange(row.id, 'new_department', value)}
                  style={{ width: 120 }}
                  disabled={row.appoint_type === '직급 변경'}
                  searchable={false}
                />
              </div>
            )}
          </Cell>
        </Column>

        <Column flexGrow={1} width={250} align="center">
          <HeaderCell>비고</HeaderCell>
          <Cell>
            {row => (
              <EditableInput
                row={row}
                field="appoint_note"
                onChange={onChange}
              />
            )}
          </Cell>
        </Column>

        <Column width={180} align="center">
          <HeaderCell>발령일자</HeaderCell>
          <Cell>
            {row => (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DatePicker
                  value={row.appoint_date || null}
                  onChange={(value) => onChange(row.id, 'appoint_date', value)}
                  placeholder="날짜 선택"
                  format="yyyy-MM-dd"
                  style={{ width: 140, height: '36px' }}
                  shouldDisableDate={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </div>
            )}
          </Cell>
        </Column>

        <Column width={110} align="center">
          <HeaderCell>작업</HeaderCell>
          <Cell>
            {row => (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  appearance="ghost"
                  size="xs"
                  color="red"
                  onClick={() => {
                    setEmployees(prev => {
                      if (prev.length <= 1) {
                        alert('발령 대상자는 최소 1명 이상이어야 합니다.');
                        return prev;
                      }
                      return prev.filter(emp => emp.id !== row.id);
                    });
                  }}
                >
                  삭제
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal size="sm" open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>사원 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeSelectTable
            data={empList}
            selectedId={selectedEmp}
            onSelect={setSelectedEmp}
            selectedEmployeeIds={rows.map(r => r.e_id)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalOpen(false)} appearance="subtle">
            취소
          </Button>
          <Button onClick={handleConfirmModal} appearance="primary">
            선택
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HrAppointEditTable;
