/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Modal, Form, Radio, RadioGroup, Button, ButtonGroup, Schema } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import Btn from "./Btn";

const { StringType } = Schema.Types;

const model = Schema.Model({
  a_name: StringType()
    .isRequired("근태명을 입력해주세요")
    .minLength(2, "2글자 이상 입력해주세요"),
  a_note: StringType().maxLength(100, "100자 이내로 작성해주세요"),
});

const AttUpdateModal = ({ isOpen, onClose, editingRow, onReloading }) => {
  const fetchURL = AppConfig.fetch['mytest'];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;

  const [att, setAtt] = useState({
    a_code: "",
    a_name: "",
    a_type: "",
    a_use: "",
    a_note: "",
  });
  const [formError, setFormError] = useState({});

  // editingRow 가 변경되면 useEffect 를 통해 모달 내부 폼을 초기화한다.
  useEffect(() => {
    if (editingRow) {
      setAtt(editingRow);
      setFormError({});
    }
  }, [editingRow]);

  // 사용자가 입력을 변경하면 handleChange 함수가 실행되어 입력값과 유효성 검사결과가 상태에 반영된다.
  const handleChange = (formValue) => {
    setAtt(formValue);
    const check = model.check(formValue);
    setFormError(check);
  };

  // 저장버튼을 누르면 서버에 PUT 요청을 보내고, 성공 시 onReloading 실행.
  const handleSubmit = async () => {
    if (!att.a_code) {
      alert("수정할 항목이 없습니다.");
      return
    }

    const check = model.check(att);
    if (check.hasError) {
      setFormError(check);
      return;
    }

    try {
      const res = await fetch(`${attURL}/updateAttItems/${att.a_code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(att),
      });
      const result = await res.text();
      if (result === "1") {
        alert("수정 완료되었습니다.");
        onClose();
        // onReloading(); // fetcher로 테이블 재로딩
        window.location.reload();
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>근태 항목 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid model={model} formValue={att} onChange={handleChange}>
          <Form.Group controlId="a_code">
            <Form.ControlLabel>근태코드</Form.ControlLabel>
            <Form.Control name="a_code" value={att.a_code} disabled readOnly />
          </Form.Group>

          <Form.Group controlId="a_name">
            <Form.ControlLabel>근태명</Form.ControlLabel>
            <Form.Control name="a_name" />
          </Form.Group>

          <Form.Group controlId="a_type">
            <Form.ControlLabel>근태유형</Form.ControlLabel>
            <RadioGroup
              inline
              name="a_type"
              value={att.a_type}
              onChange={(value) => setAtt({ ...att, a_type: value })}
            >
              <Radio value="기본">기본</Radio>
              <Radio value="휴가">휴가</Radio>
              <Radio value="출/퇴근">출/퇴근</Radio>
            </RadioGroup>
          </Form.Group>

          <Form.Group controlId="a_use">
            <Form.ControlLabel>사용여부</Form.ControlLabel>
            <RadioGroup
              inline
              name="a_use"
              value={att.a_use}
              onChange={(value) => setAtt({ ...att, a_use: value })}
            >
              <Radio value="Y">Y</Radio>
              <Radio value="N">N</Radio>
            </RadioGroup>
          </Form.Group>

          <Form.Group controlId="a_note">
            <Form.ControlLabel>비고</Form.ControlLabel>
            <Form.Control name="a_note" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Btn text="저장" onClick={handleSubmit} size="sm" />
        <Btn text="취소" onClick={onClose} size="sm" style={{ color: "grey", borderColor: "grey" }} />
      </Modal.Footer>
    </Modal>
  );
};

export default AttUpdateModal;
