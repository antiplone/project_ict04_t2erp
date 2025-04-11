import React, { useState, useEffect } from 'react';
import { HrTable } from '#components/hr/HrTable';
import HrButton from '#components/hr/HrButton';
import HrModal from '#components/hr/HrModal';
import { Input, Grid, Col, Message } from 'rsuite';

export default function Hr_emp_card() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemStandard, setItemStandard] = useState('');
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [regDate, setRegDate] = useState('');

  const handleOpen = () => {
    setItemCode('');
    setItemName('');
    setItemStandard('');
    setIsEditMode(false);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setItemCode('');
    setItemName('');
    setItemStandard('');
  };

  const fetchItems = () => {
    fetch('http://localhost:8081/hrCard/hrCardList')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('데이터를 불러오지 못했습니다:', error));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (message && message.includes('성공')) {
      fetchItems();
    }
  }, [message]);

  const handleRegister = () => {
    const newItem = {
      item_code: itemCode,
      item_name: itemName,
      item_standard: itemStandard,
      item_reg_date: new Date().toISOString(),
    };

    fetch('http://localhost:8081/hrCard/hrCardInsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (!response.ok) throw new Error('서버에서 오류가 발생했습니다.');
        return response.json();
      })
      .then((data) => {
        if (data === 1 || data.success === true) {
          handleClose();
        }
      })
      .catch((error) => {
        setMessage('등록 중 오류 발생: ' + error.message);
      });
  };

  const handleEditClick = (rowData) => {
    setItemCode(rowData.item_code);
    setItemName(rowData.item_name);
    setItemStandard(rowData.item_standard);
    setRegDate(rowData.item_reg_date);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleEditSubmit = () => {
    const editedItem = {
      item_code: itemCode,
      item_name: itemName,
      item_standard: itemStandard,
      item_reg_date: regDate,
    };

    fetch(`http://localhost:8081/basic/itemUpdate/${itemCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedItem),
    })
      .then((response) => {
        if (!response.ok) throw new Error('서버에서 오류가 발생했습니다.');
        return response.json();
      })
      .then((data) => {
        if (data === 1 || data.success === true) {
          handleClose();
          fetchItems();
        }
      })
      .catch((error) => {
        setMessage('수정 중 오류 발생: ' + error.message);
      });
  };

  const handleDeleteClick = (item_code) => {
    fetch(`http://localhost:8081/basic/itemDelete/${item_code}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('삭제 실패');
        return response.text();
      })
      .then(() => fetchItems())
      .catch((error) => {
        console.error('삭제 중 오류 발생:', error);
        alert("삭제에 실패했습니다.");
      });
  };

  const columns = [
    { label: '사원 번호', dataKey: 'item_code', width: 150 },
    { label: '이름', dataKey: 'item_name', width: 300 },
    { label: '전화번호', dataKey: 'item_standard', width: 350 },
    { label: '등록일', dataKey: 'item_reg_date', width: 250 },
  ];

  return (
    <div style={{ padding: '30px', width: '100%' }}>
      <Message><h5>인사 카드 등록</h5></Message>

      <div style={{ maxWidth: '1450px' }}>
        <HrTable
          columns={columns}
          items={items}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <HrButton hrBtn="인사카드등록" onClick={handleOpen} />
        </div>
      </div>

      {message && !message.includes('등록 성공') && (
        <div style={{ color: 'green' }}>
          {message}
        </div>
      )}

      <HrModal
        title={isEditMode ? "인사카드 수정" : "인사카드 등록"}
        open={open}
        handleClose={handleClose}
        onRegister={isEditMode ? handleEditSubmit : handleRegister}
        onDeleteClick={handleDeleteClick}
        backdrop="static"
        onBackdropClick={(e) => e.stopPropagation()}
      >
        <Grid fluid>
          <Col xs={24}>
            <label>사원 이름 *</label>
            <Input value={itemName} onChange={setItemName} />
          </Col>
          <Col xs={24}>
            <label>전화번호 *</label>
            <Input value={itemStandard} onChange={setItemStandard} />
          </Col>
        </Grid>
      </HrModal>
    </div>
  );
}
