import React, { useState, useEffect } from 'react';
import { HrTable } from '#components/hr/HrTable';
import HrButton from '#components/hr/HrButton';
import HrModal from '#components/hr/HrModal';
import { Input, Grid, Col, Button, Message } from 'rsuite';
import ErrorText from '#components/hr/ErrorText';         // 필수 입력란 미입력 시 에러 메세지
import HrDropdown from '#components/hr/HrDropdown';
import HrRadio from '#components/hr/HrRadio';
import "#components/common/css/common.css";   // Message 컴포넌트
import HrEmpCardDetail from './main.hr_emp_card_detail.$e_id';
import { Link } from '@remix-run/react';

// 초기 입력값 공통 정의
const initialFormData = {
  e_id: '',
  e_name: '',
  e_tel: '',
  e_position: '',
  e_reg_date: '',
  e_status: '',
  e_email: '',
  e_birth: '',
  e_entry: '',
  e_address: '',
  e_photo: '',
  e_salary_account_bank: '',
  e_salary_account_num: '',
  e_salary_account_owner: '',
  e_note: '',
  d_code: '',     // 부서 코드 저장
};

export default function Hr_emp_card() {
  const [open, setOpen] = useState(false);    // useState - 화면에 보여질 값들을 기억
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [hrCardData, setHrCardData] = useState(initialFormData); 
  const [selectedEid, setSelectedEid] = useState(null);   // 상세페이지에 보여줄 id
  const [deptList, setDeptList] = useState([]);           // 부서명 리스트

  // 인사카드 목록
  const fetchHrCardList = () => {
    fetch('http://localhost:8081/hrCard/hrCardList')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);     // 목록 갱신
      })
      .catch((err) => console.error('데이터를 불러오지 못했습니다:', err));
  };

  // 부서 목록 불러오기
  const fetchDeptList = () => {
    fetch('http://localhost:8081/hrDept/hrDeptList')
      .then(res => res.json())
      .then(data => {
        // label은 화면에 보여질 부서명, value는 저장할 부서코드
        const mapped = data.map(dept => ({
          label: dept.d_name,
          value: dept.d_code
        }));
        setDeptList(mapped);
      })
      .catch(err => console.error('부서 목록 불러오기 실패:', err));
  };

  // useEffect 안에서 부서 목록 불러오기 실행
  useEffect(() => {       // 화면이 처음 열릴 때 실행
    fetchHrCardList();    // 기존 사원 목록 서버에서 불러오기
    fetchDeptList();      // 부서 목록도 같이 불러오기/ 빈배열 처음 한 번만 실행됨
  }, []);

  useEffect(() => {
    fetch('http://localhost:8081/hrCard/hrCardList')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      })
      .catch((err) => console.error('데이터를 불러오지 못했습니다:', err));
  }, []);

  const handleOpen = () => {
    setIsEditMode(false);
    setHrCardData(initialFormData); // 모달 열기 전 초기화
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setHrCardData(initialFormData); // 모달 닫을 때도 초기화
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!hrCardData.e_name.trim()) newErrors.e_name = "이름은 필수 항목입니다.";
    if (!hrCardData.e_tel.trim()) newErrors.e_tel = "전화번호는 필수 항목입니다.";
    if (!hrCardData.e_email.trim()) newErrors.e_email = "이메일은 필수 항목입니다.";
    if (!hrCardData.e_birth) newErrors.e_birth = "생년월일은 필수 항목입니다.";
    if (!hrCardData.e_position.trim()) newErrors.e_position = "직위는 필수 항목입니다.";
    if (!hrCardData.e_status.trim()) newErrors.e_status = "재직 상태는 필수 항목입니다.";    
    if (!hrCardData.e_salary_account_bank.trim()) newErrors.e_salary_account_bank = "은행명은 필수 항목입니다.";
    if (!hrCardData.e_salary_account_num.trim()) newErrors.e_salary_account_num = "계좌번호는 필수 항목입니다.";
    if (!hrCardData.e_salary_account_owner.trim()) newErrors.e_salary_account_owner = "예금주는 필수 항목입니다.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    const newEmployee = {
      e_name: hrCardData.e_name,
      e_tel: hrCardData.e_tel,
      e_position: hrCardData.e_position,
      e_status: hrCardData.e_status,
      e_email: hrCardData.e_email,
      e_birth: hrCardData.e_birth,
      e_entry: hrCardData.e_entry,
      e_address: hrCardData.e_address,
      e_photo: hrCardData.e_photo,
      e_salary_account_bank: hrCardData.e_salary_account_bank,
      e_salary_account_num: hrCardData.e_salary_account_num,
      e_salary_account_owner: hrCardData.e_salary_account_owner,
      e_note: hrCardData.e_note,
      d_code: hrCardData.d_code
    };

    fetch('http://localhost:8081/hrCard/hrCardInsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => {
        if (!response.ok) throw new Error('서버에서 오류가 발생했습니다.');
        return response.json();
      })
      .then((data) => {
        if (data === 1 || data.success === true) {
          handleClose();
          fetch('http://localhost:8081/hrCard/hrCardList')
            .then((res) => res.json())
            .then((data) => setItems(data));
        }
      })
      .catch((error) => {
        setMessage('등록 중 오류 발생: ' + error.message);
      });
  };

  const columns = [
    { label: '사원 번호', dataKey: 'e_id', width: 100 },
    { label: '이름', dataKey: 'e_name', width: 150 },
    { label: '전화번호', dataKey: 'e_tel', width: 210 },
    { label: '이메일', dataKey: 'e_email', width: 300 },
    { label: '부서', dataKey: 'd_name', width: 150 },
    { label: '직위', dataKey: 'e_position', width: 120 },
    { label: '재직 상태', dataKey: 'e_status', width: 120 },
    { label: '등록일', dataKey: 'e_reg_date', width: 200 },
  ];

  const positionList = ['사원', '대리', '과장', '차장', '부장', '이사', '상무', '전무'];    // 직위 dropDown list/ 문자열 배열

  return (
    <>
        <div style={{ padding: '30px', width: '100%' }}>
          <Message type="success" className="main_title">
              인사카드 등록
          </Message>
          <div style={{ maxWidth: '1450px' }}>
            <HrTable
              columns={columns}
              items={items}
              renderActionButtons={(rowData) => (     // renderActionButtons 각 행마다 버튼을 렌더링 하는 함수
                <Link to={`/main/hr_emp_card_detail/${rowData.e_id}`} >
                  조회
                </Link>
                // </Button>
              )}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <HrButton hrBtn="인사카드등록" onClick={handleOpen} />
            </div>
          </div>
  
          <HrModal
            title={isEditMode ? "인사카드 수정" : "인사카드 등록"}    // isEditMode === true 인사카드 수정, isEditMode === false 인사카드 등록
            open={open}       // 모달 열기(true)
            handleClose={handleClose}     // 모달 닫기
            onRegister={isEditMode ? () => {} : handleRegister}   // 등록 버튼 눌렀을 때 실행되는 함수
            onDeleteClick={() => {}}
            backdrop="static"
            onBackdropClick={(e) => e.stopPropagation()}
          >
            <Grid fluid>
              <Col xs={24}>
                <label>사원 이름 *</label>
                <Input
                  value={hrCardData.e_name}   // 현재 상태값
                  onChange={(value) => setHrCardData({ ...hrCardData, e_name: value })}   // 입력할 때마다 상태 업데이트
                />
                <ErrorText message={errors.e_name} />
              </Col>
              <Col xs={24}>
                <label>전화번호 *</label>
                <Input
                  value={hrCardData.e_tel}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_tel: value })}
                />
                <ErrorText message={errors.e_tel} />
              </Col>
              <Col xs={24}>
                <label>이메일 *</label>
                <Input
                  value={hrCardData.e_email}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_email: value })}
                />
                <ErrorText message={errors.e_email} />
              </Col>
              <Col xs={24}>
                <label>생년월일 *</label>
                <Input
                  type="date"
                  value={hrCardData.e_birth}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_birth: value })}
                />
                <ErrorText message={errors.e_birth} />
              </Col>
              <Col xs={24}>
                <label>부서 *</label>
                <HrDropdown
                  title={
                    deptList.find((dept) => dept.value === hrCardData.d_code)?.label || '부서를 선택하세요'   // 부서코드(hrCardData.d_code)와 같은 값을 가진 부서를 찾아서 dropdown에 표시, 못 찾으면 ''메세지 출력
                  }
                  items={deptList}  // [{label: '기획팀', value: 'D001'}, ...]
                  onSelect={(val) => setHrCardData({ ...hrCardData, d_code: val })}
                  style={{ width: '100%' }}
                  menuStyle={{ width: 120 }}
                />
                <ErrorText message={errors.d_code} />
              </Col>
              <Col xs={24}>
                <label>직위 *</label>
                <HrDropdown
                    title={hrCardData.e_position || "직위를 선택하세요"}
                    items={['사원', '대리', '과장', '차장', '부장', '이사', '상무', '전무']}
                    onSelect={(val) => setHrCardData({ ...hrCardData, e_position: val })}
                    style={{ width: '100%' }}
                    menuStyle={{ width: 120 }}
                  />
                <ErrorText message={errors.e_position} />
              </Col>
              <Col xs={24}>
                <label>재직 상태 *</label>
                <Input
                  value={hrCardData.e_status}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_status: value })}
                />
                <ErrorText message={errors.e_status} />
              </Col>
              <Col xs={24}>
                <label>입사 구분</label>
                <HrRadio
                  value={hrCardData.e_entry}
                  onChange={(val) => setHrCardData({ ...hrCardData, e_entry: val })}
                  options={['신입', '경력']}
                />
              </Col>
              <Col xs={24}>
                <label>주소</label>
                <Input
                  value={hrCardData.e_address}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_address: value })}
                />
              </Col>
              <Col xs={24}>
                <label>사진</label>
                <Input
                  value={hrCardData.e_photo}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_photo: value })}
                />
              </Col>
              <Col xs={24}>
                <label>급여통장 - 은행 *</label>
                <Input
                  value={hrCardData.e_salary_account_bank}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_salary_account_bank: value })}
                />
                <ErrorText message={errors.e_salary_account_bank} />
              </Col>
              <Col xs={24}>
                <label>급여통장 - 계좌번호 *</label>
                <Input
                  value={hrCardData.e_salary_account_num}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_salary_account_num: value })}
                />
                <ErrorText message={errors.e_salary_account_num} />
              </Col>
              <Col xs={24}>
                <label>급여통장 - 예금주 *</label>
                <Input
                  value={hrCardData.e_salary_account_owner}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_salary_account_owner: value })}
                />
                <ErrorText message={errors.e_salary_account_owner} />
              </Col>
              <Col xs={24}>
                <label>비고</label>
                <Input
                  as="textarea"
                  rows={3}
                  value={hrCardData.e_note}
                  onChange={(value) => setHrCardData({ ...hrCardData, e_note: value })}
                />
              </Col>
            </Grid>
          </HrModal>
        </div>
      {/* )} */}
    </>
  );
  
}