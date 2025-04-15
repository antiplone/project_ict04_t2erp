import React, { useState, useEffect } from 'react';
import { HrTable } from '#components/hr/HrTable';
import HrButton from '#components/hr/HrButton';
import HrModal from '#components/hr/HrModal';
import { Input, Grid, Col, Button, Message } from 'rsuite';
import ErrorText from '#components/hr/ErrorText';         // 필수 입력란 미입력 시 에러 메세지
import "#components/common/css/common.css";   // Message 컴포넌트

// 초기 입력값 공통 정의
const initialFormData = {
  d_code: '',
  d_name: '',
  d_tel: '',
  d_manager: '',
  d_address: '',
};

export default function Hr_department() {
  const [open, setOpen] = useState(false);    // useState - 화면에 보여질 값들을 기억
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [hrDeptData, setHrDeptData] = useState(initialFormData); 

  // 목록 불러오는 함수
  const fetchHrDeptList = () => {
    fetch('http://localhost:8081/hrDept/hrDeptList')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);     // 목록 갱신
      })
      .catch((err) => console.error('데이터를 불러오지 못했습니다:', err));
  };

  useEffect(() => {     // 화면이 처음 열릴 때 실행
    fetchHrDeptList();  // 사원 목록 서버에서 불러오기
  }, []);   // 빈배열 처음 한 번만 실행됨

  const handleOpen = () => {
    setIsEditMode(false);
    setHrDeptData(initialFormData); // 모달 열기 전 초기화
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setHrDeptData(initialFormData); // 모달 닫을 때도 초기화
    setErrors({});
  };

  // 필수입력란 미입력 시 에러 메세지
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

    // 부서 등록
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
          onEditClick={() => {}}
          onDeleteClick={() => {}}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <HrButton hrBtn="부서 등록" onClick={handleOpen} />
        </div>
      </div>

      <HrModal
        title={isEditMode ? '부서 수정' : '부서 등록'}
        open={open}
        handleClose={handleClose}
        onRegister={isEditMode ? () => {} : handleRegister}
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
