import React, { useEffect, useState } from "react";
import { Button, Message, Tabs } from "rsuite";
import HrAppointEditTable from "#components/hr/HrAppoint";
import { HrReadOnlyTable } from "#components/hr/HrTable";

export default function HrEmpAppointment() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      e_id: "",
      e_name: "",
      prev_position: "",
      prev_department: "",
      appoint_type: "",
      new_position: "",
      new_department: "",
      appoint_note: "",
      appoint_date: null
    }
  ]);

  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  // 부서 목록 fetch
  useEffect(() => {
    fetch("http://localhost:8081/hrDept/deptList")
      .then(res => res.json())
      .then(data => {
        const converted = data.map(dep => ({
          label: dep.d_name,  // 드롭다운 표시용
          value: dep.d_name   // 선택값 저장용
        }));
        setDepartmentList(converted);
      })
      .catch(err => console.error("부서 목록 불러오기 실패:", err));
  }, []);

  // 행 값 변경
  const handleChange = (id, key, value) => {
    const updated = employees.map((row) =>
      row.id === id ? { ...row, [key]: value } : row
    );
    setEmployees(updated);
  };

  // 확정 버튼
  const handleConfirmAppointments = () => {
    setConfirmedAppointments((prev) => [...prev, ...employees]);
    setEmployees([
      {
        id: 1,
        e_id: "",
        e_name: "",
        prev_position: "",
        prev_department: "",
        appoint_type: "",
        new_position: "",
        new_department: "",
        appoint_note: "",
        appoint_date: null
      }
    ]);
  };

  // 행 추가 버튼
  const handleAddRow = () => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees(prev => [
      ...prev,
      {
        id: newId,
        e_id: "",
        e_name: "",
        prev_position: "",
        prev_department: "",
        appoint_type: "",
        new_position: "",
        new_department: "",
        appoint_note: "",
        appoint_date: null
      }
    ]);
  };

  const appointColumns = [
    { label: "사번", dataKey: "e_id", width: 100 },
    { label: "성명", dataKey: "e_name", width: 120 },
    { label: "발령구분", dataKey: "appoint_type", width: 120 },
    { label: "이전 직급", dataKey: "prev_position", width: 150 },
    { label: "발령 직급", dataKey: "new_position", width: 150 },
    { label: "이전 부서", dataKey: "prev_department", width: 150 },
    { label: "발령 부서", dataKey: "new_department", width: 150 },
    { label: "비고", dataKey: "appoint_note", width: 180 },
    { label: "발령일자", dataKey: "appoint_date", width: 180 }
  ];

  return (
    <div style={{ padding: "30px" }}>
      <Message type="info" className="main_title">인사 발령</Message>

      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="발령 대상자">
          <HrAppointEditTable
            rows={employees}
            onChange={handleChange}
            onDoubleClickCell={(id) => console.log("더블클릭된 ID:", id)}
            departmentList={departmentList} // fetch된 부서 리스트 전달
          />
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button appearance="ghost" onClick={handleAddRow} style={{ marginRight: 10 }}>
              행 추가
            </Button>
            <Button appearance="primary" onClick={handleConfirmAppointments}>
              발령 확정
            </Button>
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey="2" title="발령 현황">
          <HrReadOnlyTable items={confirmedAppointments} columns={appointColumns} />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
