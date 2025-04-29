/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  Schema,
  DatePicker,
  DateRangePicker,
} from "rsuite";
import AppConfig from "#config/AppConfig.json";

const { StringType, ArrayType } = Schema.Types;

// pattern 메서드: 단순한 문자열 형식 검사
// addRule 메서드: 숫자 크기, 범위, 조건식 등 로직 포함 검사
// Schema
const model = Schema.Model({
  v_code: StringType()
    .isRequired("휴가코드를 입력해주세요")
    .pattern(/^2\d{4}$/, "휴가코드는 20190 이상 29999 이하의 숫자여야 합니다")
    .addRule((value) => {
      const num = parseInt(value, 10);
      return num >= 20190 && num <= 29999;
    }, "휴가코드는 20190 이상 29999 이하의 숫자여야 합니다"),
  
  v_name: StringType()
    .isRequired("휴가명을 입력해주세요")
    .minLength(2, "2글자 이상 입력해주세요"),

  v_period: ArrayType()
  .isRequired("휴가기간을 선택해주세요")
  .addRule((value) => value.length === 2, "시작일과 종료일을 모두 선택해주세요"),

  v_note: StringType().maxLength(100, "100자 이내로 작성해주세요"),
});

const VacaModal = ({ open, onClose }) => {
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

  // 저장 버튼을 눌렀을 때
  const insertVaca = async () => {
    const [startDate, endDate] = vaca.v_period || [];
    const formatDate = (date) =>
      date?.toLocaleDateString("sv-SE");  // "yyyy-MM-dd"

    const payload = {
      ...vaca,
      v_start: formatDate(startDate),
      v_end: formatDate(endDate),
    };

    const res = await fetch(`${attURL}/addVacaItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // form 상태
    });
  
    if (res.status === 201) {
      showToast("등록에 성공했습니다.", "success");
      onClose();
      // onReloading();    // 테이블 리로딩
      window.location.reload();
    } else {
      showToast("등록 실패.", "error");
    }
  };

  useEffect(() => {
    if (!open) {
      setVaca({
        v_code: "",
        v_name: "",
        v_type: "",
        v_use: "",
        v_note: "",
      });
      setFormError({});
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>휴가항목 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form model={model} formValue={vaca} onChange={vacaChange} fluid>
          <Form.Group controlId="v_code">
            <Form.ControlLabel>휴가코드 <span style={{ color: "red" }}>*</span></Form.ControlLabel>
            <Form.Control name="v_code" />
            <Form.HelpText>휴가코드는 20190부터 시작합니다.</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="v_name">
            <Form.ControlLabel>휴가명 <span style={{ color: "red" }}>*</span></Form.ControlLabel>
            <Form.Control name="v_name" />
          </Form.Group>

          <Form.Group controlId="v_period">
            <Form.ControlLabel>휴가기간 <span style={{ color: "red" }}>*</span></Form.ControlLabel>
            {/* <Form.Control name="v_period" /> */}
            <Form.Control
              name="v_period"
              accepter={DateRangePicker}
              format="yyyy-MM-dd"  // 원하는 날짜 형식 (옵션)
              placeholder="날짜를 선택하세요"
              style={{ width: 300 }}/>
          </Form.Group>

          <Form.Group controlId="v_note">
            <Form.ControlLabel>비고</Form.ControlLabel>
            <Form.Control name="v_note" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">닫기</Button>
        <Button onClick={insertVaca} appearance="primary">저장</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VacaModal;
