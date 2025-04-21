/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Modal, Button, Form, Schema } from "rsuite";
import { useState, useEffect } from "react";

const { StringType } = Schema.Types;

const model = Schema.Model({
  co_start_time: StringType().isRequired("출근시간을 입력해주세요"),
  co_end_time: StringType().isRequired("퇴근시간을 입력해주세요")
});

export default function CommuteUpdateModal({ open, onClose, rowData, attURL, onRefresh }) {
  const [formValue, setFormValue] = useState({});

  useEffect(() => {
    setFormValue(rowData || {}); // rowData가 변경되면 form 업데이트
  }, [rowData]);

  const submitBtn = async () => {
    const res = await fetch(`${attURL}/commUpdate/${e_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValue)
    });

    const result = await res.text();
    alert(result);
    onRefresh(); // 테이블 새로고침
    onClose();   // 모달 닫기
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>근무 기록 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid model={model} formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.ControlLabel>출근 시간</Form.ControlLabel>
            <Form.Control name="co_start_time" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>퇴근 시간</Form.ControlLabel>
            <Form.Control name="co_end_time" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>상태</Form.ControlLabel>
            <Form.Control name="co_status" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>비고</Form.ControlLabel>
            <Form.Control name="co_status_note" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={submitBtn} appearance="primary">수정</Button>
        <Button onClick={onClose} appearance="subtle">취소</Button>
      </Modal.Footer>
    </Modal>
  );
}
