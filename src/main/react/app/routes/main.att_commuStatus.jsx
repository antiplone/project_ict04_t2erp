import React from "react";
import { Link } from "react-router-dom";
import { Button, ButtonToolbar, DateRangePicker, Form, Radio, RadioGroup } from "rsuite";
import MessageBox from "#components/common/MessageBox";


export default function att_commuStatus() {
  return (
    <div className="attItems">
      <MessageBox text="출/퇴근 현황" />

      <Form
        appearance="picker"
        style={{ border: "1px solid #999", padding: 30, borderRadius: 10 }}
      >
        <Form.Group
          controlId="e_regDate"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Form.ControlLabel>기간</Form.ControlLabel>
          <Form.Control name="e_regDate" accepter={DateRangePicker} />
        </Form.Group>

        <Form.Group
          controlId="e_name"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Form.ControlLabel>사원명</Form.ControlLabel>
          <Form.Control name="e_name" />
        </Form.Group>

        <Form.Group
          controlId="e_depart"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Form.ControlLabel>부서명</Form.ControlLabel>
          <Form.Control name="e_depart" />
        </Form.Group>

        <Form.Group
          controlId="e_ternal"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Form.ControlLabel>외/내근구분</Form.ControlLabel>
          <Form.Control name="e_ternal" accepter={RadioGroup}>
            <div>
              <Radio value="">전체</Radio>
              <Radio value="O">외근</Radio>
              <Radio value="I">내근</Radio>
            </div>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <ButtonToolbar>
            <Button as={Link} to="/main/att_commuStatusList">
              검색
            </Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </div>
  );
};
