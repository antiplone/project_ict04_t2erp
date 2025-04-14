import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // useParams 훅 사용
import { Table, Grid, Col } from 'rsuite';  // Table 컴포넌트 추가

const ClientDetail = () => {
  const { client_code } = useParams();  // URL에서 client_code 받아오기
  console.log('클라이언트 코드:', client_code);
  const [clientDetails, setClientDetails] = useState(null);  // 클라이언트 상세 데이터 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);  // 오류 상태

  useEffect(() => {
    if (client_code) {
      console.log('client_code:', client_code);  // client_code가 제대로 넘어오는지 확인
      fetch(`http://localhost:8081/main/client/${client_code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('API 호출 오류');
          }
          return response.json();
        })
        .then((data) => {
          console.log('데이터:', data);  // 받은 데이터를 확인
          setClientDetails(data);  // 데이터 상태 업데이트
          setLoading(false);  // 로딩 완료
        })
        .catch((error) => {
          console.error('API 호출 실패:', error);  // 오류 처리
          setError(error.message);  // 오류 메시지 설정
          setLoading(false);  // 로딩 완료
        });
    }
  }, [client_code]);

  // 로딩 중일 때
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 오류가 있을 때
  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  // 데이터가 없을 때
  if (!clientDetails) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  // 데이터 표시용 테이블 설정
  const clientData = [
    { label: '거래처 코드', value: clientDetails.client_code },
    { label: '거래처명', value: clientDetails.client_name },
    { label: '대표자명', value: clientDetails.c_ceo },
    { label: '사업자등록번호', value: clientDetails.c_biz_num },
    { label: '거래처 연락처', value: clientDetails.c_tel },
    { label: '거래처 주소', value: clientDetails.c_address },
    { label: '거래처 유형', value: clientDetails.c_type },
    { label: '업종', value: clientDetails.c_industry },
    { label: '상태', value: clientDetails.c_status },
    { label: '비고', value: clientDetails.c_note },
    { label: '등록일', value: clientDetails.c_reg_date },
  ];

  return (
    <div style={{ padding: '30px', width: '100%', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h4>거래처 상세</h4>
      <Grid fluid>
        <Col xs={24}>
          <Table
            height={400}
            data={clientData}
            bordered
            cellPadding={10}
            wordWrap
          >
            <Table.Column width={200} align="center">
              <Table.HeaderCell>항목</Table.HeaderCell>
              <Table.Cell dataKey="label" />
            </Table.Column>
            <Table.Column width={300} align="left">
              <Table.HeaderCell>내용</Table.HeaderCell>
              <Table.Cell dataKey="value" />
            </Table.Column>
          </Table>
        </Col>
      </Grid>
    </div>
  );
};

export default ClientDetail;
