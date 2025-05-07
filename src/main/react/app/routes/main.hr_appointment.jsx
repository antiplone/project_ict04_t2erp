import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import { Button, Message, Tabs } from "rsuite";
import HrAppointEditTable from "#components/hr/HrAppoint";
import MessageBox from "#components/common/MessageBox.jsx";
import { HrAppointListTable } from "#components/hr/HrTable.jsx";
import HrModal from "#components/hr/HrModal.jsx";
import { formatDate } from "#components/hr/HrDate";

export default function HrEmpAppointment() {
  const fetchURL = AppConfig.fetch["mytest"];

  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [smsModalOpen, setSmsModalOpen] = useState(false); // 문자 모달 열기
  const [smsText, setSmsText] = useState('');  // 문자 내용

  const [employees, setEmployees] = useState([
    {
      id: 1,
      e_id: "",
      e_name: "",
      old_position: "",
      old_department: "",
      appoint_type: [],
      new_position: "",
      new_department: "",
      appoint_note: "",
      appoint_date: null
    }
  ]);


  useEffect(() => {
    fetchHrDeptList();
    fetchConfirmedAppointments();
  }, []);

  const fetchHrDeptList = () => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/hrDept/hrDeptList`)
      .then(res => res.json())
      .then(data => {
        const converted = data.map(dep => ({
          label: dep.d_name,
          value: dep.d_code
        }));
        setDepartmentList(converted);
      })
      .catch(err => console.error("부서 목록 불러오기 실패:", err));
  };

  // 발령 현황 목록
  const fetchConfirmedAppointments = () => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/hrAppoint/hrAppointList`)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          ...item,
          appoint_date: item.appoint_date ? item.appoint_date.slice(0, 10) : ''
        }));
        setConfirmedAppointments(formattedData);
      })
      .catch(err => console.error('발령 현황 목록 불러오기 실패:', err));
  };

  const handleChange = (id, key, value) => {
    const updated = employees.map((row) =>
      row.id === id ? { ...row, [key]: value } : row
    );
    setEmployees(updated);
  };

  const handleConfirmAppointments = () => {
    if (employees.length === 0) {
      alert('확정할 발령 대상자가 없습니다.');
      return;
    }

    for (const emp of employees) {
      const appointTypeArr = Array.isArray(emp.appoint_type) ? emp.appoint_type : [];
    
      if (appointTypeArr.includes('부서 이동') && !emp.new_department) {
        alert(`사번 ${emp.e_id || '(미입력)'}: 부서 이동인 경우 발령 부서는 필수입니다.`);
        return;
      }
      if (appointTypeArr.includes('직급 변경') && !emp.new_position) {
        alert(`사번 ${emp.e_id || '(미입력)'}: 직급 변경인 경우 발령 직급은 필수입니다.`);
        return;
      }
      if (!emp.appoint_date) {
        alert(`사번 ${emp.e_id || '(미입력)'}: 발령일자를 선택해주세요.`);
        return;
      }
    }

  let successCount = 0;
  let failCount = 0;

  const requests = employees.map((emp) => {
    // 부서명을 부서코드로 변환
  const foundDept = departmentList.find(dep => dep.value === emp.new_department);
  const deptCode = foundDept ? foundDept.value : '';  // 부서코드

  const appointData = {
    e_id: emp.e_id,
    e_name: emp.e_name,
    appoint_type: Array.isArray(emp.appoint_type) ? emp.appoint_type.join(', ') : emp.appoint_type,
    old_position: emp.old_position,
    new_position: emp.new_position,
    old_department: emp.old_department,
    new_department: deptCode,
    d_code: deptCode,             // 인사카드에 업데이트
    appoint_note: emp.appoint_note,
    appoint_date: emp.appoint_date,
  };
  
    return fetch(`${fetchURL.protocol}${fetchURL.url}/hrAppoint/hrAppointInsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointData)
    })
    .then((response) => {
      if (response.ok) {
        successCount++;
      } else {
        failCount++;
      }
    })
    .catch((err) => {
      console.error('발령 확정 실패:', err);
      failCount++;
    });
  });
  

  Promise.all(requests).then(() => {
    if (successCount > 0) {
      alert('발령 확정 완료');
      fetchConfirmedAppointments();
      setEmployees([
        {
          id: 1,
          e_id: "",
          e_name: "",
          old_position: "",
          old_department: "",
          appoint_type: "",
          new_position: "",
          new_department: "",
          appoint_note: "",
          appoint_date: null
        }
      ]);
    } else {
      alert('발령 확정 실패');
    }
  });
};

  const handleAddRow = () => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees(prev => [...prev, defaultEmployee(newId)]);
  };

  const defaultEmployee = (id = 1) => ({
    id: id,
    e_id: "",
    e_name: "",
    old_position: "",
    old_department: "",
    appoint_type: "",
    new_position: "",
    new_department: "",
    appoint_note: "",
    appoint_date: null
  });

  // 문자 발송
  const handleSendSms = async () => {
    if (selectedIds.length === 0) {
      alert('문자를 보낼 사원을 선택하세요.');
      return;
    }
  
    if (!smsText.trim()) {
      alert('문자 내용을 입력하세요.');
      return;
    }
  
    try {
      // 최신 사원 정보 불러오기 (전화번호 최신화용)
      const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/hrCard/hrCardList`);
      const empList = await res.json();
  
      for (const appointId of selectedIds) {
        // 발령 내역에서 appoint_id로 대상 찾기
        const targetAppoint = confirmedAppointments.find(item => item.appoint_id === appointId);
        if (!targetAppoint) continue;
  
        // 해당 발령건의 e_id로 전화번호 찾기
        const emp = empList.find(emp => emp.e_id === targetAppoint.e_id);
        if (!emp) continue;
  
        const cleanPhoneNumber = emp.e_tel?.replace(/-/g, '');
  
        await fetch(`${fetchURL.protocol}${fetchURL.url}/sms/sendSms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cleanPhoneNumber,
            text: smsText
          })
        });
      }
  
      alert('문자 발송 완료!');
      setSmsModalOpen(false);
      setSmsText('');
    } catch (error) {
      console.error('문자 발송 실패:', error);
      alert('문자 발송 실패');
    }
  };
  

  const [selectedIds, setSelectedIds] = useState([]);

  const appointColumns = [
    { label: "사번", dataKey: "e_id", width: 130 },
    { label: "성명", dataKey: "e_name", width: 145 },
    { label: "발령구분", dataKey: "appoint_type", width: 145 },
    { label: "이전 직급", dataKey: "old_position", width: 150 },
    { label: "발령 직급", dataKey: "new_position", width: 150 },
    { label: "이전 부서", dataKey: "old_department", width: 150 },
    { label: "발령 부서", dataKey: "new_department", width: 150 },
    { label: "비고", dataKey: "appoint_note", width: 250 },
    {
      label: "발령일자",
      dataKey: "appoint_date",
      width: 200,
      renderCell: (rowData) => formatDate(rowData.appoint_date)
    }
  ];

  return (
    <div>
      <MessageBox text="인사카드 관리" />

      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="발령 대상자">
          <HrAppointEditTable
            key={JSON.stringify(employees)}
            rows={employees}
            onChange={handleChange}
            onDoubleClickCell={(id) => console.log("더블클릭된 ID:", id)}
            setEmployees={setEmployees}
            departmentList={departmentList}
          />
          <div style={{ textAlign: "left", marginTop: "25px" }}>
            <Button appearance="ghost" onClick={handleAddRow} style={{ marginRight: 10 }}>
              행 추가
            </Button>
            <Button appearance="primary" onClick={handleConfirmAppointments}>
              발령 확정
            </Button>
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey="2" title="발령 현황">
          <HrAppointListTable 
            items={confirmedAppointments}
            columns={appointColumns}
            selectedIds={selectedIds}
            onSelect={setSelectedIds}
          />
          <div style={{ textAlign: "left", marginTop: "25px" }}>
          <Button
            appearance="primary"
            onClick={() => {
              if (selectedIds.length === 0) {
                alert('문자를 보낼 사원을 선택하세요.');
                return;
              }
              setSmsModalOpen(true); // 사원 선택한 경우에만 모달 열기
            }}
          >
              문자 발송
            </Button>
          </div>

          <HrModal
            open={smsModalOpen}
            handleClose={() => setSmsModalOpen(false)}
            title="문자 발송"
            onRegister={handleSendSms}  // 보내기 눌렀을 때 문자 보내기
            confirmText="보내기"
          >
            <textarea
              rows={5}
              style={{ width: '100%', boxSizing: 'border-box', resize: 'none', padding: '10px', fontSize: '16px', border: '1px solid #ccc',
              borderRadius: '6px' }}
              placeholder="보낼 문자 내용을 입력하세요."
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
            />
          </HrModal>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
