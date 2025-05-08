import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from 'react';
import { HrTable } from '#components/hr/HrTable';
import HrButton from '#components/hr/HrButton';
import HrModal from '#components/hr/HrModal';
import { Input, Grid, Col, Message } from 'rsuite';
import ErrorText from '#components/hr/ErrorText';
import { useToast } from '#components/common/ToastProvider';
import "#components/common/css/common.css";

const initialFormData = {
  d_code: '',
  d_name: '',
  d_tel: '',
  d_manager: '',
};

export default function Hr_department() {
  const fetchURL = AppConfig.fetch['mytest'];
  const hrURL = `${fetchURL.protocol}${fetchURL.url}/hrDept`;
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [hrDeptData, setHrDeptData] = useState(initialFormData);
  const [isCodeChecked, setIsCodeChecked] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const { showToast } = useToast();

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
    const requiredFields = [
      { key: "d_code", label: "부서 코드" },
      { key: "d_name", label: "부서명" },
      { key: "d_tel", label: "전화번호" },
    ];
  
    const emptyFields = requiredFields.filter(field => !hrDeptData[field.key]?.trim());
  
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(f => f.label).join(", ");
      showToast(`다음 항목을 입력해주세요: ${fieldNames}`, "warning");
      return false;
    }
  
    return true;
  };
  
  const handleRegister = () => {
    if (!validate()) return;

    const newDept = {
      d_code: hrDeptData.d_code,
      d_name: hrDeptData.d_name,
      d_tel: hrDeptData.d_tel,
      d_manager: hrDeptData.d_manager,
    };

    fetch(`${hrURL}/hrDeptInsert`, {
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
          showToast('부서가 등록되었습니다.', 'success');
          handleClose();
          fetchHrDeptList();
        }
      })
      .catch((err) => setMessage('등록 중 오류 발생: ' + err.message));
  };

  const handleUpdate = () => {
    if (!validate()) return;

    fetch(`${hrURL}/hrDeptUpdate/${hrDeptData.d_code}`, {
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
    const confirmDelete = window.confirm("해당 부서를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    fetch(`${hrURL}/hrDeptDelete/${d_code}`, {
      method: 'DELETE'
    })
    .then((res) => {
      if (!res.ok) throw new Error('삭제 실패');
      return res.text();
    })
    .then(() => {
      showToast('부서가 삭제되었습니다.', 'success');
      fetchHrDeptList();
    })
    .catch((err) => {
      console.error('삭제 중 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    });
  };

  const columns = [
    { label: '부서 코드', dataKey: 'd_code', width: 430 },
    { label: '부서명', dataKey: 'd_name', width: 430 },
    { label: '전화번호', dataKey: 'd_tel', width: 440 },
    { label: '부서장', dataKey: 'd_manager', width: 430 },
  ];

  return (
    <div style={{ width: '100%' }}>
      <Message type="success" className="main_title">부서 관리</Message>

      <div className="remove-outer-border">
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
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
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
            onChange={(val) => {
              setHrDeptData({ ...hrDeptData, d_code: val });
              setIsCodeChecked(false);  // 값이 바뀌면 다시 확인하게 함
            }}
            disabled={isEditMode}
            style={{ marginBottom: 20 }}
          />
          <ErrorText message={errors.d_code} />
        </Col>
          <Col xs={24}>
            <label>부서명 *</label>
            <Input
              value={hrDeptData.d_name}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_name: val })}
              style={{ marginBottom: 20 }}
            />
            <ErrorText message={errors.d_name} />
          </Col>
          <Col xs={24}>
            <label>전화번호 *</label>
            <Input
              value={hrDeptData.d_tel}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_tel: val })}
              style={{ marginBottom: 20 }}
            />
            <ErrorText message={errors.d_tel} />
          </Col>
          <Col xs={24}>
            <label>부서장</label>
            <Input
              value={hrDeptData.d_manager}
              onChange={(val) => setHrDeptData({ ...hrDeptData, d_manager: val })}
              style={{ marginBottom: 10 }}
            />
          </Col>
        </Grid>
      </HrModal>
    </div>
  );
}
