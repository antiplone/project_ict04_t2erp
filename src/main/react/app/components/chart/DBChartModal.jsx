import React, { useState } from 'react';
import { Modal, Button } from 'rsuite'; // rsuite 기준, 다른 UI 프레임워크도 OK
import DBChart from './DBChart'; // 아까 만든 차트 컴포넌트

const DBChartModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>DB 기반 차트 보기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DBChart />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DBChartModal;
