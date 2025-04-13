/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Button,
  Form,
  Modal,
  Radio,
  RadioGroup,
  Schema,
  SelectPicker,
} from "rsuite";
import AppConfig from "#config/AppConfig.json";

const { StringType } = Schema.Types;

// Schema
const model = Schema.Model({
  a_code: StringType()
    .isRequired("휴가코드를 입력해주세요")
    .pattern(/^2\d{4}$/, "휴가코드는 20000~29999 형식이어야 합니다."),
});

const VacaModal = ({ open, onClose, onReloading }) => {
  const fetchURL = AppConfig.fetch['mytest'];

  const [formError, setFormError] = useState({});
  const [vacationList, setVacationList] = useState([]);
  const [att, setAtt] = useState({
    a_code: "",
    a_name: "",
    a_type: "기본",
    a_use: "",
    a_note: "",
    v_name: "",
  });

  const handleChange = (formValue) => {
    setAtt(formValue);
    const check = model.check(formValue);
    setFormError(check);
  };

  const vacaNameChange = (value) => {
    const updated = { ...att, a_type: value, v_name: "" };
    setAtt(updated);
    if (value === "휴가") {
      setVacationList([
        { v_name: "연차" },
        { v_name: "병가" },
        { v_name: "경조사" },
      ]);
    } else {
      setVacationList([]);
    }
  };

  const handleVacationChange = (value) => {
    setAtt((prev) => ({ ...prev, v_name: value }));
  };

  const insertAtt = async () => {
    const response = await fetch(`${fetchURL.protocol}${fetchURL.url}/attendance/addAttItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(att), // form 상태
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
      setAtt({
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
        <Form model={model} formValue={att} onChange={handleChange} fluid>
          <Form.Group controlId="a_code">
            <Form.ControlLabel>휴가코드 *</Form.ControlLabel>
            <Form.Control name="a_code" />
            <Form.HelpText>근태코드는 30000부터 시작합니다.</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="a_name">
            <Form.ControlLabel>휴가명</Form.ControlLabel>
            <Form.Control name="a_name" />
          </Form.Group>

          <Form.Group controlId="a_type">
            <Form.ControlLabel>휴가기간</Form.ControlLabel>
          </Form.Group>

          <Form.Group controlId="a_note">
            <Form.ControlLabel>비고</Form.ControlLabel>
            <Form.Control name="a_note" />
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
