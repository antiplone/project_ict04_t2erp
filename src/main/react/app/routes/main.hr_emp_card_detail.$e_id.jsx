import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Grid, Col, Button } from 'rsuite';
import HrModal from '#components/hr/HrModal';
import ErrorText from '#components/hr/ErrorText';
import HrDropdown from '#components/hr/HrDropdown';

export default function HrEmpCardDetail({ e_id, onBack }) {
  const [detail, setDetail] = useState(null);
  const [open, setOpen] = useState(false); // 수정 모달
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});

  const positionList = ['사원', '대리', '과장', '차장', '부장', '이사', '상무', '전무'];

  // 상세 정보 조회
  useEffect(() => {
    fetch(`http://localhost:8081/hrCard/hrCardDetail/${e_id}`)
      .then(res => res.json())
      .then(data => {
        setDetail(data);
        setEditData(data);
      })
      .catch(err => console.error("상세 조회 실패:", err));
  }, [e_id]);

  if (!detail) return <div>로딩 중...</div>;

  // 유효성 검사
  const validate = () => {
    const newErrors = {};
    if (!editData.e_name?.trim()) newErrors.e_name = "이름은 필수입니다.";
    if (!editData.e_tel?.trim()) newErrors.e_tel = "전화번호는 필수입니다.";
    if (!editData.e_position?.trim()) newErrors.e_position = "직위는 필수입니다.";
    if (!editData.e_status?.trim()) newErrors.e_status = "재직 상태는 필수입니다.";
    if (!editData.e_email?.trim()) newErrors.e_email = "이메일은 필수입니다.";
    if (!editData.e_birth) newErrors.e_birth = "생년월일은 필수입니다.";
    if (!editData.e_salary_account_bank?.trim()) newErrors.e_salary_account_bank = "은행명은 필수입니다.";
    if (!editData.e_salary_account_num?.trim()) newErrors.e_salary_account_num = "계좌번호는 필수입니다.";
    if (!editData.e_salary_account_owner?.trim()) newErrors.e_salary_account_owner = "예금주는 필수입니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;

    fetch(`http://localhost:8081/hrCard/hrCardUpdate/${e_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    })
      .then(res => {
        if (!res.ok) throw new Error('수정 실패');
        return res.json();
      })
      .then(() => {
        setOpen(false);
        setDetail(editData); // 화면 갱신
      })
      .catch(err => {
        alert('수정 중 오류 발생: ' + err.message);
      });
  };

  // 삭제 요청
  const handleDelete = () => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    fetch(`http://localhost:8081/hrCard/hrCardDelete/${e_id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('삭제 실패');
        return res.text();
      })
      .then(() => {
        onBack(); // 목록으로 이동
      })
      .catch(err => {
        alert('삭제 중 오류 발생: ' + err.message);
      });
  };

  const displayOrDash = (value) => value ? value : '-';

  return (
    <div style={{ padding: '30px' }}>
      <h4>사원 상세 정보</h4>
      <p>사원 번호: {detail.e_id}</p>
      <p>사원 이름: {detail.e_name}</p>
      <p>전화번호: {detail.e_tel}</p>
      <p>직위: {detail.e_position}</p>
      <p>재직 상태: {detail.e_status}</p>
      <p>이메일: {detail.e_email}</p>
      <p>생년월일: {detail.e_birth}</p>
      <p>입사 구분: {displayOrDash(detail.e_entry)}</p>
      <p>주소: {displayOrDash(detail.e_address)}</p>
      <p>사진: {displayOrDash(detail.e_photo)}</p>
      <p>급여통장 - 은행: {detail.e_salary_account_bank}</p>
      <p>급여통장 - 계좌번호: {detail.e_salary_account_num}</p>
      <p>급여통장 - 예금주: {detail.e_salary_account_owner}</p>
      <p>비고: {displayOrDash(detail.e_note)}</p>
      <p>등록일: {detail.e_reg_date}</p>

      <div style={{ marginTop: '20px' }}>
        <Button appearance="ghost" onClick={() => setOpen(true)}>수정</Button>{' '}
        <Button appearance="ghost" color="red" onClick={handleDelete}>삭제</Button>{' '}
        <Button appearance="ghost" style={{ color: 'black', borderColor: 'black' }} onClick={onBack}>← 목록으로</Button>
      </div>

      {/* 수정 모달 */}
      <HrModal
        open={open}
        handleClose={() => setOpen(false)}
        title="사원 정보 수정"
        onRegister={handleUpdate}
      >
        <Grid fluid>
          <Col xs={24}><label>사원 이름 *</label><Input value={editData.e_name} onChange={v => setEditData({ ...editData, e_name: v })} /><ErrorText message={errors.e_name} /></Col>
          <Col xs={24}><label>전화번호 *</label><Input value={editData.e_tel} onChange={v => setEditData({ ...editData, e_tel: v })} /><ErrorText message={errors.e_tel} /></Col>
          <Col xs={24}><label>직위 *</label><HrDropdown title={editData.e_position || '직위를 선택하세요'} items={positionList} onSelect={(v) => setEditData({ ...editData, e_position: v })} style={{ width: '100%' }} /><ErrorText message={errors.e_position} /></Col>
          <Col xs={24}><label>재직 상태 *</label><Input value={editData.e_status} onChange={v => setEditData({ ...editData, e_status: v })} /><ErrorText message={errors.e_status} /></Col>
          <Col xs={24}><label>이메일 *</label><Input value={editData.e_email} onChange={v => setEditData({ ...editData, e_email: v })} /><ErrorText message={errors.e_email} /></Col>
          <Col xs={24}><label>생년월일 *</label><Input type="date" value={editData.e_birth} onChange={v => setEditData({ ...editData, e_birth: v })} /><ErrorText message={errors.e_birth} /></Col>
          <Col xs={24}><label>입사 구분</label><Input value={editData.e_entry || ''} onChange={v => setEditData({ ...editData, e_entry: v })} /></Col>
          <Col xs={24}><label>주소</label><Input value={editData.e_address || ''} onChange={v => setEditData({ ...editData, e_address: v })} /></Col>
          <Col xs={24}><label>사진</label><Input value={editData.e_photo || ''} onChange={v => setEditData({ ...editData, e_photo: v })} /></Col>
          <Col xs={24}><label>급여통장 - 은행 *</label><Input value={editData.e_salary_account_bank} onChange={v => setEditData({ ...editData, e_salary_account_bank: v })} /><ErrorText message={errors.e_salary_account_bank} /></Col>
          <Col xs={24}><label>급여통장 - 계좌번호 *</label><Input value={editData.e_salary_account_num} onChange={v => setEditData({ ...editData, e_salary_account_num: v })} /><ErrorText message={errors.e_salary_account_num} /></Col>
          <Col xs={24}><label>급여통장 - 예금주 *</label><Input value={editData.e_salary_account_owner} onChange={v => setEditData({ ...editData, e_salary_account_owner: v })} /><ErrorText message={errors.e_salary_account_owner} /></Col>
          <Col xs={24}><label>비고</label><Input as="textarea" rows={3} value={editData.e_note || ''} onChange={v => setEditData({ ...editData, e_note: v })} /></Col>
        </Grid>
      </HrModal>
    </div>
  );
}

HrEmpCardDetail.propTypes = {
  e_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBack: PropTypes.func.isRequired,
};
