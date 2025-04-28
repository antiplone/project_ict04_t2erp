/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  DatePicker,
  SelectPicker,
  Panel,
  Schema,
  Message,
} from "rsuite";
import AppConfig from "#config/AppConfig.json";

const { StringType, DateType } = Schema.Types;

const model = Schema.Model({
  re_type: StringType().isRequired("퇴직 유형은 필수입니다."),
  re_date: DateType().isRequired("퇴사 예정일은 필수입니다."),
  re_request_reason: StringType()
    .isRequired("퇴직 사유를 입력해주세요.")
    .minLength(5, "5자 이상 입력해주세요."),
});

const typeOptions = [
  { label: "사직", value: "사직" },
  { label: "퇴사", value: "퇴사" },
  { label: "면직", value: "면직" },
  { label: "기타", value: "기타" },
];

export default function RetireInsertForm({ e_id, e_name, e_position, d_name }) {
  const fetchURL = AppConfig.fetch["mytest"];
  const hrURL = `${fetchURL.protocol}${fetchURL.url}/hr`;

  const [formValue, setFormValue] = useState({
    re_type: "",
    re_date: null,
    re_request_reason: "",
  });
  const [formError, setFormError] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!model.check(formValue)) {
      setFormError(model.getErrors(formValue));
      return;
    }

    const payload = {
      ...formValue,
      e_id,
      e_name,
      e_position,
      d_name,
    };

    fetch(`${hrURL}/hrRetirementInsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.text();
      })
      .then((msg) => {
        setMessage("퇴직 신청이 완료되었습니다.");
        setFormValue({ re_type: "", re_date: null, re_request_reason: "" });
      })
      .catch((err) => {
        setMessage("신청 실패: " + err.message);
      });
  };

  return (
    <Panel header="퇴직 신청서 작성" bordered style={{ maxWidth: 700, margin: "0 auto" }}>
      {message && <Message showIcon type="info">{message}</Message>}

      <Form
        fluid
        model={model}
        formValue={formValue}
        onChange={setFormValue}
        onCheck={setFormError}
      >
        <Form.Group>
          <Form.ControlLabel>퇴직 유형</Form.ControlLabel>
          <Form.Control
            name="re_type"
            accepter={SelectPicker}
            data={typeOptions}
            placeholder="선택"
            block
          />
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>퇴사 예정일</Form.ControlLabel>
          <Form.Control name="re_date" accepter={DatePicker} format="yyyy-MM-dd" placeholder="날짜 선택" shouldDisableDate={(date) => date < new Date()} block />
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>퇴직 사유</Form.ControlLabel>
          <Form.Control name="re_request_reason" rows={5} componentClass="textarea" placeholder="사유를 입력해주세요..." />
        </Form.Group>

        <Form.Group>
          <Button appearance="primary" onClick={handleSubmit} block>
            퇴직 신청
          </Button>
        </Form.Group>
      </Form>
    </Panel>
  );
}