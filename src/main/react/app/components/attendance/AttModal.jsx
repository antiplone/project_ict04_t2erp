// 아직 정리가 안되었습니다.. 일단 돌아가는지 확인해보려고 넣었습니다.
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Radio, RadioGroup, Schema } from "rsuite";
import { useNavigate } from "react-router-dom";

const { StringType } = Schema.Types;
const model = Schema.Model({
  a_code: StringType().isRequired("근태코드를 입력해주세요"),
  a_name: StringType().isRequired("근태명을 입력해주세요"),
});

// eslint-disable-next-line react/prop-types
const AttModal = ({ open, onClose }) => {
  const [formError, setFormError] = useState({});
  const [att, setAtt] = useState({
    a_code: "",
    a_name: "",
    a_type: "기본",
    a_use: "",
    a_note: "",
  });

  const navigate = useNavigate();

  const changeValue = (name, value) => {
    setAtt((prevAtt) => ({ ...prevAtt, [name]: value }));
  };

  const handleTypeChange = (value) => {
    changeValue("a_type", value);
  };

  const submitAtt = (obj) => {
    console.log(obj)
    const checkResult = model.check(att);
    if (!checkResult.hasError) {
      fetch("http://localhost:8081/attendance/addAttItems", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(att),
      })
        .then((res) => (res.status === 201 ? res.json() : null))
        .then((res) => {
          if (res) {
            alert("등록되었습니다");
            navigate("/main/regAttItems");
            onClose();
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error("오류 발생:", error);
          alert("등록에 실패했습니다");
        });
    } else {
      setFormError(checkResult);
      console.log("오류 발생");
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
        <Form model={model} onChange={setAtt} formValue={att} fluid>
          <Form.Group controlId="a_code">
            <Form.ControlLabel>근태코드</Form.ControlLabel>
            <Form.Control
              name="a_code"
              errorMessage={formError.a_code}
              onChange={(value) => changeValue("a_code", value)}
            />
            <Form.HelpText>근태코드는 30000부터 시작합니다.</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="a_name">
            <Form.ControlLabel>근태명</Form.ControlLabel>
            <Form.Control
              name="a_name"
              errorMessage={formError.a_name}
              onChange={(value) => changeValue("a_name", value)}
            />
          </Form.Group>

          <Form.Group controlId="a_type">
            <Form.ControlLabel>근태유형</Form.ControlLabel>
            <RadioGroup inline name="a_type" value={att.a_type} onChange={handleTypeChange}>
              <Radio value="기본">기본</Radio>
              <Radio value="휴가">휴가</Radio>
              <Radio value="출/퇴근">출/퇴근</Radio>
            </RadioGroup>
          </Form.Group>

          <Form.Group controlId="a_note">
            <Form.ControlLabel>비고</Form.ControlLabel>
            <Form.Control
              name="a_note"
              onChange={(value) => changeValue("a_note", value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">닫기</Button>
        <Button appearance="primary" onClick={submitAtt}>저장</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttModal;
