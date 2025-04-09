/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Modal, Radio, RadioGroup } from "rsuite";
import { useNavigate } from "react-router-dom";

// 아직 정리가 안되었습니다.. 일단 돌아가는지 확인해보려고 넣었습니다.
const VacaUpdateModal = ({ isOpen, onClose, editingRow }) => {
  const navigate = useNavigate();

  // 입력한 값들을 submit 하려면 값을 상태로 보관한다.
  // 입력한 값들을 set 하여 att 변수(=AttItemsDTO)에 대입한 후, submit 할 때 att 값을 한 꺼번에 전송한다.
  const [att, setAtt] = useState({
    // json 형식. key: value
    // att 에 넘길 초기값.
    a_code: "",
    // a_code: `{a_code}`,
    a_name: "",
    a_type: "",
    a_use: "",
    // a_type: `{a_type}`,
    // a_use: `{a_use}`,
    a_note: "",
  });

  // 모달이 열릴 때 기존 데이터를 세팅
  useEffect(() => {
    if (editingRow) {
      setAtt(editingRow);
    }
  }, [editingRow]);

  const changeValue = (value, key) => {
    setAtt((prev) => ({ ...prev, [key]: value }));
  };

  // 1. 아래 url로 요청시, 서버쪽에서 받아주는지 확인
  // 2. 실제로 받았다면 save가 제대로 되었는지 확인
  const submitAtt = (a_code) => {
    console.log(a_code); // a_code가 찍히는지 확인

    if (!att.a_code) {
      alert("수정할 항목이 없습니다.");
      return;
    }

    fetch(`http://localhost:8081/attendance/updateAttItems/${att.a_code}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(att), // javascript 오브젝트를 json 으로 변경해서 넘긴다. 저장한 데이터를 스프링부트에서 insert 하고 201(create-생성)을 리턴한다.
    })
      .then((res) => res.text())
      .then((res) => {
        if (res === "1") {
          alert(`근태코드 ${att.a_code}가 수정되었습니다.`);
          navigate("/main/att_regAttItems"); // true라면, 게시글 목록으로 이동
          window.location.reload();
        } else {
          alert("수정에 실패했습니다.");
        }
      })
      .catch((error) => console.error("삭제 중 오류 발생:", error));
    onClose(); // 모달 닫기
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>데이터 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Form.Group controlId="a_code">
            <Form.ControlLabel>근태 코드</Form.ControlLabel>
            <Form.Control value={att.a_code} disabled />
          </Form.Group>

          <Form.Group controlId="a_name">
            <Form.ControlLabel>이름</Form.ControlLabel>
            <Form.Control value={att.a_name} onChange={(value) => changeValue(value, "a_name")} />
          </Form.Group>

          <Form.Group controlId="a_type">
            <Form.ControlLabel>유형</Form.ControlLabel>
            <RadioGroup inline name="a_type" value={att.a_type} onChange={(value) => changeValue(value, "a_type")}>
              <Radio value="기본">기본</Radio>
              <Radio value="휴가">휴가</Radio>
              <Radio value="출/퇴근">출/퇴근</Radio>
            </RadioGroup>
          </Form.Group>

          <Form.Group controlId="a_use">
            <Form.ControlLabel>사용 여부</Form.ControlLabel>
            <RadioGroup inline name="a_use" value={att.a_use} onChange={(value) => changeValue(value, "a_use")}>
              <Radio value="Y">Yes</Radio>
              <Radio value="N">No</Radio>
            </RadioGroup>
          </Form.Group>

          <Form.Group controlId="a_note">
            <Form.ControlLabel>비고</Form.ControlLabel>
            <Form.Control value={att.a_note} onChange={(value) => changeValue(value, "a_note")} />
          </Form.Group>

          <ButtonGroup>
            <Button appearance="primary" onClick={submitAtt}>
              저장
            </Button>
            <Button appearance="subtle" onClick={onClose}>
              취소
            </Button>
          </ButtonGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default VacaUpdateModal;
