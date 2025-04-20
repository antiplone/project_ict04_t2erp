import React, { useState, useEffect } from 'react';
import { HrTable } from '#components/hr/HrTable';
import HrButton from '#components/hr/HrButton';
import HrModal from '#components/hr/HrModal';
import { Input, Grid, Col, Button, Message } from 'rsuite';
import ErrorText from '#components/hr/ErrorText';
import "#components/common/css/common.css";

const initialFormData = {
  d_code: '',
  d_name: '',
  d_tel: '',
  d_manager: '',
  d_address: '',
};

export default function Hr_department() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [hrDeptData, setHrDeptData] = useState(initialFormData);

  const fetchHrDeptList = () => {
    fetch('http://localhost:8081/hrDept/hrDeptList')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('데이터를 불러오지 못했습니다:', err));
  };

  useEffect(() => {
    fetchHrDeptList();
  }, []);

  const handleOpen = () => {
    setIsEditMode(false);
    setHrDeptData(initialFormData);
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setHrDeptData(initialFormData);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!hrDeptData.d_code.trim()) newErrors.d_code = "부서코드는 필수 항목입니다.";
    if (!hrDeptData.d_name.trim()) newErrors.d_name = "부서명은 필수 항목입니다.";
    if (!hrDeptData.d_tel.trim()) newErrors.d_tel = "전화번호는 필수 항목입니다.";
    if (!hrDeptData.d_address) newErrors.d_address = "주소는 필수 항목입니다.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    const newDept = {
      d_code: hrDeptData.d_code,
      d_name: hrDeptData.d_name,
      d_tel: hrDeptData.d_tel,
      d_address: hrDeptData.d_address,
      d_manager: hrDeptData.d_manager,
    };

    fetch('http://localhost:8081/hrDept/hrDeptInsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDept),
    })
      .then((response) => {
        if (!response.ok) throw new Error('서버에서 오류가 발생했습니다.');
        return response.json();
      })
      .then((data) => {
        if (data === 1 || data.success === true) {
          handleClose();
          fetchHrDeptList();
        }
      })
      .catch((err) => setMessage('등록 중 오류 발생: ' + err.message));
  };

  const handleUpdate = () => {
    if (!validate()) return;

    fetch(`http://localhost:8081/hrDept/hrDeptUpdate/${hrDeptData.d_code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hrDeptData)
    })
      .then((res) => {
        if (!res.ok) throw new Error('수정 실패');
        return res.json();
      })
      .then(() => {
        handleClose();
        fetchHrDeptList();
      })
      .catch((err) => setMessage('수정 중 오류 발생: ' + err.message));
  };

  const handleDelete = (d_code) => {
    fetch(`http://localhost:8081/hrDept/hrDeptDelete/${d_code}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) throw new Error('삭제 실패');
        fetchHrDeptList();
      })
      .catch((err) => setMessage('삭제 중 오류 발생: ' + err.message));
  };

  const columns = [
    { label: '부서 코드', dataKey: 'd_code', width: 210 },
    { label: '부서명', dataKey: 'd_name', width: 210 },
    { label: '전화번호', dataKey: 'd_tel', width: 250 },
    { label: '부서장', dataKey: 'd_manager', width: 210 },
    { label: '주소', dataKey: 'd_address', width: 320 },
  ];

  return (
    <div style={{ padding: '30px', width: '100%' }}>
      <Message type="success" className="main_title">부서 관리</Message>

      <div style={{ maxWidth: '1450px' }}>
        <HrTable
          columns={columns}
          items={items}
          onEditClick={(rowData) => {
            setIsEditMode(true);
            setHrDeptData(rowData);
            setOpen(true);
          }}
          onDeleteClick={(rowData) => handleDelete(rowData.d_code)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <HrButton hrBtn="부서 등록" onClick={handleOpen} />
        </div>
      </div>

      <HrModal
        title={isEditMode ? '부서 수정' : '부서 등록'}
        open={open}
        handleClose={handleClose}
        onRegister={isEditMode ? handleUpdate : handleRegister}
        onDeleteClick={() => {}}
        backdrop="static"
        onBackdropClick={(e) => e.stopPropagation()}
      >
        <Grid fluid>
          <Col xs={24}>
            <label>부서 코드 *</label>
            <Input
              value={hrDeptData.d_code}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_code: val })}
              disabled={isEditMode}
            />
            <ErrorText message={errors.d_code} />
          </Col>
          <Col xs={24}>
            <label>부서명 *</label>
            <Input
              value={hrDeptData.d_name}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_name: val })}
            />
            <ErrorText message={errors.d_name} />
          </Col>
          <Col xs={24}>
            <label>전화번호 *</label>
            <Input
              value={hrDeptData.d_tel}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_tel: val })}
            />
            <ErrorText message={errors.d_tel} />
          </Col>
          <Col xs={24}>
            <label>주소 *</label>
            <Input
              value={hrDeptData.d_address}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_address: val })}
            />
            <ErrorText message={errors.d_address} />
          </Col>
          <Col xs={24}>
            <label>부서장</label>
            <Input
              value={hrDeptData.d_manager}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_manager: val })}
            />
          </Col>
        </Grid>
      </HrModal>
    </div>
  );
}
