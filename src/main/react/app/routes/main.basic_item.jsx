import React, { useState, useEffect } from 'react';
import { HrTable } from '#components/hr/HrTable';  // 테이블 컴포넌트
import HrButton from '#components/hr/HrButton'; // 버튼 컴포넌트
import HrModal from '#components/hr/HrModal'; // 모달 컴포넌트
import { Input, Grid, Col, RadioGroup, Radio, Message } from 'rsuite'; // UI 컴포넌트
import MessageBox from '#components/common/MessageBox.jsx';

export default function Item() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('Y');
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemStandard, setItemStandard] = useState('');
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);  // 등록 setIsEditMode(false), 수정 setIsEditMode(true)
  const [regDate, setRegDate] = useState(''); // 등록일 저장

  // 모달 열기
  const handleOpen = () => {
    setItemCode('');
    setItemName('');
    setItemStandard('');
    setStatus('Y');       // 상품 상태 기본값 'Y'
    setIsEditMode(false); // 등록 모드
    setOpen(true);
  };

  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
    // 모달 닫을 때 값 초기화
    setItemCode('');
    setItemName('');
    setItemStandard('');
    setStatus(''); // 기본값 설정
  };

  // 기초 등록 - 상품목록
  const fetchItems = () => {
    fetch('http://localhost:8081/basic/itemList')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('데이터를 불러오지 못했습니다:', error)); // 요청 실패하면 console에 에러메세지 출력
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (message && message.includes('성공')) {
      fetchItems();
    }
  }, [message]);

  // 등록 버튼 클릭 시 호출
  const handleRegister = () => {
    const newItem = {
      item_code: itemCode,
      item_name: itemName,
      item_standard: itemStandard,
      item_status: status,
      item_reg_date: new Date().toISOString(),
    };

    // 기초 등록 - 상품 등록
    fetch('http://localhost:8081/basic/itemInsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버에서 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data === 1 || data.success === true) {
          handleClose();
        }
      })
      .catch((error) => {
        setMessage('상품 등록 중 오류 발생: ' + error.message);
      });
  };

  // 수정 버튼 클릭 시 호출
  const handleEditClick = (rowData) => {
    setItemCode(rowData.item_code);
    setItemName(rowData.item_name);
    setItemStandard(rowData.item_standard);
    setStatus(rowData.item_status);
    setRegDate(rowData.item_reg_date); // 기존 등록일 저장
    setIsEditMode(true); // 수정 모드
    setOpen(true); // 수정 모달 열기
  };

  // 수정 저장 버튼 클릭 시 호출
  const handleEditSubmit = () => {
    const editedItem = {
      item_code: itemCode,
      item_name: itemName,
      item_standard: itemStandard,
      item_status: status,
      item_reg_date: regDate,
    };

    // 기초 등록 - 상품 수정
    fetch(`http://localhost:8081/basic/itemUpdate/${itemCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버에서 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data === 1 || data.success === true) {
          handleClose();
          fetchItems(); // 수정 후 목록 갱신
        }
      })
      .catch((error) => {
        setMessage('상품 수정 중 오류 발생: ' + error.message);
      });
  };

  // 삭제 버튼 클릭 시 호출
  const handleDeleteClick = (rowData) => {
    const item_code = rowData.item_code;
    console.log('삭제 요청한 item_code:', item_code);

    fetch(`http://localhost:8081/basic/itemDelete/${item_code}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('삭제 실패');
        return response.text();
      })
      .then((text) => {
        console.log('삭제 성공:', text);
        setItems([]);
        fetchItems(); // 삭제 후 목록 갱신
      })
      .catch((error) => {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제에 실패했습니다.');
      });
  };

  const columns = [
    { label: '상품 코드', dataKey: 'item_code', width: 150 },
    { label: '상품명', dataKey: 'item_name', width: 300, align: 'left' },
    { label: '물품 규격', dataKey: 'item_standard', width: 350, align: 'left' },
    { label: '사용 구분', dataKey: 'item_status', width: 150 },
    { label: '등록일', dataKey: 'item_reg_date', width: 250 },
  ];

  return (
    <div style={{ width: '100%' }}>
      <MessageBox text="기초등록 - 상품 등록" />

      <div style={{ maxWidth: '1450px' }}>
        {/* 테이블 렌더링 */}
        <HrTable columns={columns} items={items} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick}/> 

        {/* 상품 등록 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
          <HrButton hrBtn="상품 등록" onClick={handleOpen} />
        </div>
      </div>

      {/* 등록/수정 시 메시지 */}
      {message && !message.includes('상품 등록 성공') && (
        <div style={{ color: 'green' }}>
          {message}
        </div>
      )}

      {/* 상품 등록/수정 모달 */}
      <HrModal
        title={isEditMode ? "상품 수정" : "상품 등록"}
        open={open}
        handleClose={handleClose}
        onRegister={isEditMode ? handleEditSubmit : handleRegister}
        onDeleteClick={handleDeleteClick}
        backdrop="static"
      >
        <Grid fluid>
          <Col xs={24}>
            <label>상품명 *</label>
            <Input value={itemName} onChange={setItemName} />
          </Col>
          <Col xs={24}>
            <label>물품 규격 *</label>
            <Input value={itemStandard} onChange={setItemStandard} />
          </Col>
          <Col xs={24}>
            <label>사용 구분 *</label>
            <RadioGroup name="item_status" value={status} onChange={setStatus} inline>
              <Radio value="Y">사용 중</Radio>
              <Radio value="N">사용하지 않음</Radio>
            </RadioGroup>
          </Col>
        </Grid>
      </HrModal>
    </div>
  );
};