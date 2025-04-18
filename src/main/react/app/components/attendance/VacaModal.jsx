/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  Schema,
} from "rsuite";
import AppConfig from "#config/AppConfig.json";

const { StringType } = Schema.Types;

// Schema
const model = Schema.Model({
  v_code: StringType()
    .isRequired("휴가코드를 입력해주세요")
    .pattern(/^2\d{4}$/, "휴가코드는 20000~29999 형식이어야 합니다."),
  
  v_name: StringType()
    .isRequired("휴가명을 입력해주세요")
    .minLength(2, "2글자 이상 입력해주세요"),
    
  v_note: StringType().maxLength(100, "100자 이내로 작성해주세요"),
});

const VacaModal = ({ open, onClose, onReloading }) => {
  const fetchURL = AppConfig.fetch['mytest'];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;

  const [formError, setFormError] = useState({});
  const [vaca, setVaca] = useState({
    v_code: "",
    v_name: "",
    v_period: "",
    v_use: "",
    v_note: "",
  });

  const vacaChange = (formValue) => {
    setVaca(formValue);
    const check = model.check(formValue);
    setFormError(check);
  };

  const insertAtt = async () => {
    const response = await fetch(`${attURL}/addAttItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vaca), // form 상태
    });
  
    if (response.status === 201) {
      alert("등록 성공");
      onClose();
      // onReloading();    // 테이블 리로딩
      window.location.reload();
    } else {
      alert("등록 실패");
    }
  };

  useEffect(() => {
    if (!open) {
      setVaca({
        a_code: "",
        a_name: "",
        a_type: "기본",
        a_use: "",
        a_note: "",
        v_name: "",
      });
      setFormError({});
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>휴가항목등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form model={model} formValue={vaca} onChange={vacaChange} fluid>
          <Form.Group controlId="v_code">
            <Form.ControlLabel>휴가코드 *</Form.ControlLabel>
            <Form.Control name="v_code" />
            <Form.HelpText>휴가코드는 20000부터 시작합니다.</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="v_name">
            <Form.ControlLabel>휴가명</Form.ControlLabel>
            <Form.Control name="v_name" />
          </Form.Group>

          <Form.Group controlId="v_period">
            <Form.ControlLabel>휴가 기간</Form.ControlLabel>
            <Form.Control name="v_period" />
          </Form.Group>

          <Form.Group controlId="v_note">
            <Form.ControlLabel>비고</Form.ControlLabel>
            <Form.Control name="v_note" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">닫기</Button>
        <Button onClick={insertAtt} appearance="primary">저장</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VacaModal;
