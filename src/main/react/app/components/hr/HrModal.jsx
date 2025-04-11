/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, Button } from 'rsuite';

const HrModal = ({ open, handleClose, title, children, onRegister }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      backdrop={false} // backdrop을 false로 설정
      keyboard={false} // 키보드 이벤트 비활성화 (선택 사항)
    >
      <Modal.Header>
        <Modal.Title style={{ fontSize: '24px', fontWeight: 'bold' }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onRegister} appearance="primary">등록</Button>
        <Button onClick={handleClose} appearance="subtle">취소</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HrModal;