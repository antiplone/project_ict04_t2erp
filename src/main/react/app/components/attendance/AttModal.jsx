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
import { useToast } from '#components/common/ToastProvider';

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
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;
  const { showToast } = useToast();

  const [formError, setFormError] = useState({});
  const [vacationList, setVacationList] = useState([]);
  const [att, setAtt] = useState({
    a_code: "",
    a_name: "",
    a_type: "기본",
    a_use: "Y",
    a_note: "",
    v_code: null,
    // v_name: "",
  });

  // 값 변경 핸들링
  const attChange = (formValue) => {
    setAtt(formValue);
    const check = model.check(formValue);
    setFormError(check);
  };

  // 근태유형이 '휴가'일 때 휴가 목록 설정
  const vNameChange = async (value) => {
    const updated = { ...att, a_type: value, v_code: null };
    setAtt(updated);
    
    if (value === "휴가") {
      try {
        const res = await fetch(`${attURL}/regVacaItems`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("리스트가 배열이 아닙니다.");

        // 백엔드에서 받아온 데이터로 리스트 설정
        const formatted = data.map(item => ({
          label: `${item.v_code} (${item.v_name})`,
          value: item.v_code
          // v_code: item.v_code,
        }));

        setVacationList(formatted);
      } catch (error) {
        console.error("휴가 목록 불러오기 실패:", error);
        setVacationList([]);
      }
    } else {
      setVacationList([]);
    }
  };

  // 휴가코드 선택 시 휴가명 자동 설정
  const VacaCodeChange = (value) => {
    // const selected = vacationList.find((item) => item.v_code === parseInt(value));

    // if (selected) {
      setAtt((prev) => ({
        ...prev,
        v_code: value,
        // v_code: selected.v_code,
        // v_name: selected.v_name,
      }));
    // }
  };

  const insertAtt = async () => {
    const check = model.check(att);
    if (check.hasError) {
      setFormError(check);
      return;
    }
  
    const payload = {
      ...att,
      v_code: att.a_type === '휴가' ? att.v_code : null
    };

    if (att.a_type === "휴가" && !att.v_code) {
      showToast("휴가유형을 선택한 경우, 휴가코드를 반드시 선택해야 합니다.", "info");
      return;
    }

    // 등록
    const res = await fetch(`${attURL}/addAttItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // form 상태
    });
  
    if (res.status === 201) {
      showToast("근태등록에 성공했습니다.", "success");
      onClose();
      // onReloading();    // 테이블 리로딩
      window.location.reload();
    } else {
      showToast("근태등록에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    if (!open) {
      setAtt({
        a_code: "",
        a_name: "",
        a_type: "기본",
        a_use: "Y",
        a_note: "",
        // v_code: null,
        // v_name: "",
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
        <Form model={model} formValue={att} onChange={attChange} fluid>
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
            <RadioGroup inline name="a_type" value={att.a_type} onChange={vNameChange}>
              <Radio value="기본">기본</Radio>
              <Radio value="휴가">휴가</Radio>
              <Radio value="출/퇴근">출/퇴근</Radio>
            </RadioGroup>
          </Form.Group>

          {att.a_type === "휴가" && (
            <>
              <Form.Group controlId="v_code">
                <Form.ControlLabel>휴가코드</Form.ControlLabel>
                <Form.Control
                  name="v_code"
                  accepter={SelectPicker}
                  data={vacationList}
                  onChange={VacaCodeChange}
                  value={att.v_code}
                  placeholder="휴가코드를 선택하세요"
                />
              </Form.Group>
            </>
          )}

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
