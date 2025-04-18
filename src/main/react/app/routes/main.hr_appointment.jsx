import React, { useEffect, useState } from 'react';
import { Button, Message, Tabs } from 'rsuite';
import { HrAppointTable, HrReadOnlyTable } from '#components/hr/HrTable';

export default function HrEmpAppointment() {
  const [employees, setEmployees] = useState([]); // 전체 사원 목록
  const [selectedIds, setSelectedIds] = useState([]); // 발령 등록 탭 선택 목록

  const [pendingAppointments, setPendingAppointments] = useState([]); // 발령 대상자 리스트
  const [manageSelectedIds, setManageSelectedIds] = useState([]); // 발령 관리 탭 체크박스
  const [confirmedAppointments, setConfirmedAppointments] = useState([]); // 발령 확정 목록

  // 재직 중 사원만 불러오기
  useEffect(() => {
    fetch('http://localhost:8081/hrCard/hrCardList')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(emp => emp.e_status === '재직');
        setEmployees(filtered);
      })
      .catch(err => console.error("사원 목록 불러오기 실패:", err));
  }, []);

  // 발령 등록 탭: 선택된 사원 추가
  const handleConfirm = () => {
    const selected = employees.filter(emp => selectedIds.includes(emp.e_id));

    // 기본값 포함해서 발령 대상자 리스트에 추가
    const appointments = selected.map(emp => ({
      ...emp,
      appoint_type: '',
      entry_type: '',
      old_position: emp.e_position,
      new_position: '',
      old_department: emp.d_name,
      new_department: '',
      appoint_date: '',
    }));

    setPendingAppointments(prev => [...prev, ...appointments]);
    setSelectedIds([]);
  };

  // 발령 관리 탭: 확정된 사원 추가
  const handleConfirmAppointments = () => {
    const confirmed = pendingAppointments.filter(emp => manageSelectedIds.includes(emp.e_id));
    setConfirmedAppointments(prev => [...prev, ...confirmed]);
    setPendingAppointments(prev => prev.filter(emp => !manageSelectedIds.includes(emp.e_id)));
    setManageSelectedIds([]);
  };

  // 등록/조회 탭 컬럼
  const columns = [
    { label: '사원 번호', dataKey: 'e_id', width: 170 },
    { label: '이름', dataKey: 'e_name', width: 150 },
    { label: '부서', dataKey: 'd_name', width: 150 },
    { label: '직위', dataKey: 'e_position', width: 150 },
    { label: '재직 상태', dataKey: 'e_status', width: 150 },
    { label: '전화번호', dataKey: 'e_tel', width: 250 },
  ];

  // 발령 관리 탭용 컬럼
  const appointColumns = [
    { label: '사번', dataKey: 'e_id', width: 100 },
    { label: '성명', dataKey: 'e_name', width: 120 },
    { label: '발령구분', dataKey: 'appoint_type', width: 120 },
    { label: '이전 직급', dataKey: 'old_position', width: 150 },
    { label: '발령 직급', dataKey: 'new_position', width: 150 },
    { label: '이전 부서', dataKey: 'old_department', width: 150 },
    { label: '발령 부서', dataKey: 'new_department', width: 150 },
    { label: '비고', dataKey: 'appoint_note', width: 180 },
    { label: '발령일자', dataKey: 'appoint_date', width: 180 },
  ];

  return (
    <div style={{ padding: '30px' }}>
      <Message type="info" className="main_title">인사 발령</Message>

      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="발령 등록">
          <HrAppointTable 
            items={employees}
            columns={columns}
            selectedIds={selectedIds}
            onSelectChange={setSelectedIds}
          />

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <Button appearance="ghost" color="blue" onClick={handleConfirm}>
              발령 등록
            </Button>
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey="2" title="발령 관리">
          <Message type="info">발령 대상자</Message>
          <HrAppointTable
            items={pendingAppointments}
            columns={appointColumns}
            selectedIds={manageSelectedIds}
            onSelectChange={setManageSelectedIds}
          />

          <div style={{ textAlign: 'right' }}>
            <Button appearance="primary" onClick={handleConfirmAppointments}>
              발령 확정
            </Button>
          </div>

          <Message type="info" style={{ marginTop: '40px' }}>발령 현황</Message>
          <HrReadOnlyTable
            items={confirmedAppointments}
            columns={appointColumns}
          />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
