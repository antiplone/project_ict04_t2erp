/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
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
    .isRequired("근태코드를 입력해주세요")
    .pattern(/^3\d{4}$/, "근태코드는 30000~39999 형식이어야 합니다."),
  
  a_name: StringType()
    .isRequired("근태명을 입력해주세요")
    .minLength(2, "2글자 이상 입력해주세요"),
    
  a_note: StringType().maxLength(100, "100자 이내로 작성해주세요"),
});

const AttModal = ({ open, onClose, onReloading }) => {
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

  const handleTypeChange = (value) => {
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
        <Modal.Title>근태항목등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form model={model} formValue={att} onChange={handleChange} fluid>
          <Form.Group controlId="a_code">
            <Form.ControlLabel>근태코드 *</Form.ControlLabel>
            <Form.Control name="a_code" />
            <Form.HelpText>근태코드는 30000부터 시작합니다.</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="a_name">
            <Form.ControlLabel>근태명</Form.ControlLabel>
            <Form.Control name="a_name" />
          </Form.Group>

          <Form.Group controlId="a_type">
            <Form.ControlLabel>근태유형</Form.ControlLabel>
            <RadioGroup inline name="a_type" value={att.a_type} onChange={handleTypeChange}>
              <Radio value="기본">기본</Radio>
              <Radio value="휴가">휴가</Radio>
              <Radio value="출/퇴근">출/퇴근</Radio>
            </RadioGroup>
          </Form.Group>

          {/* {att.a_type === "휴가" && (
            <Form.Group controlId="v_name">
              <Form.ControlLabel>휴가명</Form.ControlLabel>
              <Form.Control
                accepter={SelectPicker}
                name="v_name"
                data={vacationList}
                labelKey="v_name"
                valueKey="v_name"
                placeholder="휴가명을 선택하세요"
              />
            </Form.Group>
          )} */}

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

export default AttModal;
