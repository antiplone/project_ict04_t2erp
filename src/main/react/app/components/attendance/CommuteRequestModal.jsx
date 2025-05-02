/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Modal, Button, Form, Schema } from "rsuite";
import { useState, useEffect } from "react";
import { useToast } from '#components/common/ToastProvider';  // 경고창

const { StringType } = Schema.Types;

const model = Schema.Model({
  co_start_time: StringType().isRequired("출근시간을 입력해주세요"),
  co_end_time: StringType().isRequired("퇴근시간을 입력해주세요")
});

export default function CommuteRequestModal({ open, onClose, rowData, attURL, onRefresh }) {
  const { showToast } = useToast();   // 경고창
  const [formValue, setFormValue] = useState({});

  useEffect(() => {
    setFormValue(rowData || {}); // rowData가 변경되면 form 업데이트
  }, [rowData]);

  const submitBtn = async () => {
    const e_id = localStorage.getItem("e_id");
    const { co_start_time, co_end_time } = formValue;
  
    if (!co_start_time || !co_end_time) {
      showToast(`출근/퇴근 시간을 모두 입력해주세요.`, "warning");
      return;
    }
  
    // 시간 계산
    const start = new Date(`1970-01-01T${co_start_time}`);
    const end = new Date(`1970-01-01T${co_end_time}`);
    if (start >= end) {
      showToast(`퇴근 시간은 출근 시간보다 늦어야 합니다.`, "warning");
      return;
    }
  
    const diff = new Date(end - start);
    const co_total_work_time = `${String(diff.getUTCHours()).padStart(2, "0")}:${String(diff.getUTCMinutes()).padStart(2, "0")}:${String(diff.getUTCSeconds()).padStart(2, "0")}`;
  
    const res = await fetch(`${attURL}/commUpdate/${e_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formValue,
        co_total_work_time
      })
    });
  
    showToast(`수정되었습니다.`, "success");
    onClose();   // 모달 닫기
    window.location.reload();
  };
  

  return (
    <Modal open={open} onClose={onClose} size="sm" backdrop={false}>
      <Modal.Header>
        <Modal.Title>근무 기록 정정요청</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid model={model} formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.ControlLabel>출근 시간</Form.ControlLabel>
            <Form.Control name="co_start_time" type="time" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>퇴근 시간</Form.ControlLabel>
            <Form.Control name="co_end_time" type="time" />
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
