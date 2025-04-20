/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Table, Input, DatePicker, SelectPicker, Modal, Button } from 'rsuite';
import { EmployeeSelectTable } from './HrTable';

const { Column, HeaderCell, Cell } = Table;

const positionList = [
  { label: '사원', value: '사원' },
  { label: '대리', value: '대리' },
  { label: '과장', value: '과장' },
  { label: '차장', value: '차장' },
  { label: '부장', value: '부장' },
  { label: '이사', value: '이사' },
];

const HrAppointEditTable = ({ rows, onChange, onDoubleClickCell, departmentList }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [targetRowId, setTargetRowId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/hrCard/hrCardList")
      .then(res => res.json())
      .then(data => setEmpList(data))
      .catch(err => console.error("사원 불러오기 실패:", err));
  }, []);

  const handleDoubleClick = (id) => {
    setTargetRowId(id);
    setModalOpen(true);
  };

  const handleConfirmModal = () => {
    if (selectedEmp && targetRowId) {
      const selected = empList.find(emp => emp.e_id === selectedEmp);
      if (selected) {
        onChange(targetRowId, 'e_id', selected.e_id);
        onChange(targetRowId, 'e_name', selected.e_name);
        onChange(targetRowId, 'prev_position', selected.e_position);
        onChange(targetRowId, 'prev_department', selected.d_name);
      }
    }
    setModalOpen(false);
    setSelectedEmp(null);
  };

  return (
    <>
      <Table autoHeight data={rows} cellBordered bordered style={{ marginTop: 20 }}>
        <Column width={130} align="center">
          <HeaderCell>사번</HeaderCell>
          <Cell>
            {row => (
              <Input
                value={row.e_id || ''}
                onChange={(value) => onChange(row.id, 'e_id', value)}
                onDoubleClick={() => handleDoubleClick(row.id)}
                style={{ height: '36px' }}
              />
            )}
          </Cell>
        </Column>

        <Column width={130} align="center">
          <HeaderCell>성명</HeaderCell>
          <Cell>
            {row => (
              <Input
                value={row.e_name || ''}
                onChange={(value) => onChange(row.id, 'e_name', value)}
                style={{ height: '36px' }}
              />
            )}
          </Cell>
        </Column>

        <Column width={130} align="center">
          <HeaderCell>현재 직위</HeaderCell>
          <Cell>
            {row => (
              <Input
                value={row.prev_position || ''}
                onChange={(value) => onChange(row.id, 'prev_position', value)}
                style={{ height: '36px' }}
              />
            )}
          </Cell>
        </Column>

        <Column width={130} align="center">
          <HeaderCell>현재 부서</HeaderCell>
          <Cell>
            {row => (
              <Input
                value={row.prev_department || ''}
                onChange={(value) => onChange(row.id, 'prev_department', value)}
                style={{ height: '36px' }}
              />
            )}
          </Cell>
        </Column>

        <Column width={130} align="center">
          <HeaderCell>발령 구분</HeaderCell>
          <Cell>
            {row => (
              <SelectPicker
                placeholder="선택"
                data={[{ label: '부서 이동', value: '부서 이동' }, { label: '직위 변경', value: '직위 변경' }]}
                value={row.appoint_type}
                onChange={(value) => onChange(row.id, 'appoint_type', value)}
                style={{ width: 120 }}
                cleanable={false}
              />
            )}
          </Cell>
        </Column>

        <Column width={130} align="center">
          <HeaderCell>발령 직위</HeaderCell>
          <Cell>
            {row => (
              <SelectPicker
                data={positionList}
                value={row.new_position}
                onChange={(value) => onChange(row.id, 'new_position', value)}
                style={{ width: 120 }}
                disabled={row.appoint_type === '부서 이동'}
              />
            )}
          </Cell>
        </Column>

        <Column width={130} align="center">
          <HeaderCell>발령 부서</HeaderCell>
          <Cell>
            {row => (
              <SelectPicker
                data={departmentList}
                value={row.new_department}
                onChange={(value) => onChange(row.id, 'new_department', value)}
                style={{ width: 120 }}
                disabled={row.appoint_type === '직위 변경'}
              />
            )}
          </Cell>
        </Column>

        <Column width={200} align="center">
          <HeaderCell>비고</HeaderCell>
          <Cell>
            {row => (
              <Input
                value={row.appoint_note || ''}
                onChange={(value) => onChange(row.id, 'appoint_note', value)}
                style={{ height: '36px' }}
              />
            )}
          </Cell>
        </Column>

        <Column width={160} align="center">
          <HeaderCell>발령일자</HeaderCell>
          <Cell>
            {row => (
              <DatePicker
                value={row.appoint_date || null}
                onChange={(value) => onChange(row.id, 'appoint_date', value)}
                style={{ width: 140, height: '36px' }}
              />
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
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalOpen(false)} appearance="subtle">
            취소
          </Button>
          <Button onClick={handleConfirmModal} appearance="primary">
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HrAppointEditTable;
