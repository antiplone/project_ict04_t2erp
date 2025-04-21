import React, { useState, useEffect } from 'react';
import { HrTable } from '#components/hr/HrTable';  // 테이블 컴포넌트
import HrButton from '#components/hr/HrButton'; // 버튼 컴포넌트
import HrModal from '#components/hr/HrModal'; // 모달 컴포넌트
import { Input, Grid, Col } from 'rsuite'; // UI 컴포넌트
import { useNavigate } from 'react-router-dom'; // react-router-dom에서 useNavigate 가져오기

export default function Basic_client() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]); // 클라이언트 데이터 상태
  const navigate = useNavigate(); // navigate 훅 사용

  const handleOpen = () => setOpen(true); // 모달 열기
  const handleClose = () => setOpen(false); // 모달 닫기

  // 클라이언트 데이터를 fetch로 가져오는 useEffect
  useEffect(() => {
    fetch('http://localhost:8081/basic/client')
      .then(response => response.json())
      .then(data => {
        setClients(data); // 받아온 데이터로 클라이언트 상태 설정
      })
      .catch(error => console.error("데이터를 불러오지 못했습니다:", error));
  }, []);

  const columns = [
    { label: "거래처 코드", dataKey: "client_code", width: 150 },
    { label: "거래처명", dataKey: "client_name", width: 160 },
    { label: "대표자명", dataKey: "c_ceo", width: 160 },
    { label: "거래처 연락처", dataKey: "c_tel", width: 250 },
    { label: "거래처 유형", dataKey: "c_type", width: 160 },
    { label: "업종", dataKey: "c_industry", width: 160 },
    { label: "상태", dataKey: "c_status", width: 150 },
    { label: "등록일", dataKey: "c_reg_date", width: 210 }
  ];

  return (
    <div style={{ padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h4>기초 등록</h4>
      <h5>거래처 등록</h5>

      {/* 거래처 목록 테이블 렌더링 */}
      <HrTable
        columns={columns}
        items={clients}
        onEditClick={(rowData) => {
          console.log("수정:", rowData);
        }}
        onDeleteClick={(rowData) => {
          console.log("삭제:", rowData.client_code);
        }}
      />

      {/* 거래처 등록 버튼 */}
      <HrButton hrBtn="거래처 등록" onClick={handleOpen} />

      {/* 거래처 등록 모달 */}
      <HrModal title="거래처 등록" open={open} handleClose={handleClose}>
        <Grid fluid>
          <Col xs={24}><label>거래처 코드 *</label><Input /></Col>
          <Col xs={24}><label>거래처명 *</label><Input /></Col>
          <Col xs={24}><label>대표자 *</label><Input /></Col>
          <Col xs={24}><label>사업자 등록 번호 *</label><Input /></Col>
          <Col xs={24}><label>연락처 *</label><Input /></Col>
          <Col xs={24}><label>주소 *</label><Input /></Col>
          <Col xs={24}><label>거래처 유형 *</label><Input /></Col>
          <Col xs={24}><label>업종 *</label><Input /></Col>
          <Col xs={24}><label>상태 *</label><Input /></Col>
          <Col xs={24}><label>비고</label><Input /></Col>
        </Grid>
      </HrModal>
    </div>
  );
};
