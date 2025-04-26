/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button, Container, DatePicker, Form, Radio, RadioGroup, Schema, Grid, Row, Col, FlexboxGrid, Panel, Divider, ButtonToolbar, SelectPicker } from "rsuite";
import MessageBox from "#components/common/MessageBox.jsx";
import { useToast } from '#components/common/ToastProvider';

const model = Schema.Model({
  re_type: Schema.Types.StringType().isRequired("퇴직 유형은 필수입니다"),
  re_approval_status: Schema.Types.StringType().isRequired("승인 상태는 필수입니다")
});

// 퇴직관리 상세페이지
export default function HrRetirementDetail() {
  const fetchURL = AppConfig.fetch["mytest"];
  const hrURL = `${fetchURL.protocol}${fetchURL.url}/hr`;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { e_id } = useParams();     // URL에서 /hr/hrRetirementDetail/{e_id} 가져오기
  
  // Form.Control에 연결된 value 값이 null이면 경고가 발생하기 때문에, 각 값에 기본 값을 지정함.
  const [retiData, setRetiData] = useState({
    e_name: "", d_name: "", e_position: "", re_type: "",
    re_app_date: "", re_date: "", re_last_working_date: "",
    re_approval_status: "", re_succession_yn: "", re_reject_reason: "",
    re_approval_date: "",
  });
  const [formError, setFormError] = useState({});

  const approvalStatus = [
    { label: "진행중", value: "진행중" },
    { label: "승인", value: "승인" },
    { label: "반려", value: "반려" },
  ];
  const type = [
    { label: "사직", value: "사직" },
    { label: "퇴사", value: "퇴사" },
    { label: "면직", value: "면직" },
    { label: "기타", value: "면직" },
  ]

  
  useEffect(() => {
    if (!e_id) return; // undefined 방지

    fetch(`${hrURL}/hrRetirementDetail/${e_id}`)
      .then(res => res.json())
      .then(res => {
        setRetiData({
          // value 속성을 사용하지 못하기 때문에 useEffect에서 데이터를 받아올 때 날짜 필드는 미리 Date로 변환해서 값을 넣어줌
          ...res,
          re_app_date: res.re_app_date ? new Date(res.re_app_date) : null,
          re_date: res.re_date ? new Date(res.re_date) : null,
          re_last_working_date: res.re_last_working_date ? new Date(res.re_last_working_date) : null,
          re_approval_date: res.re_approval_date ? new Date(res.re_approval_date) : null,
        });
      });
  }, [e_id]);    // e_id 바뀌면 다시 fetch

  // 사용자가 입력을 변경하면 retiChange 함수가 실행되어 입력값과 유효성 검사결과가 상태에 반영된다.
  const retiChange = (formValue) => {
    setRetiData(formValue);
    const check = model.check(formValue);
    setFormError(check);
  };

  // 수정
  const updateReti = () => {
    fetch(`${hrURL}/hrRetirementUpdate/${e_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(retiData),
    })
    .then(res => res.json())
    .then(res => {
      showToast("수정이 완료되었습니다.", "success");
      navigate("/main/hr-retirement");
    })
    .catch(err => {
      showToast("수정 실패: ", "error" + err.message);
    });
  }

  // 퇴직관리 페이지로 이동
  const retiList = () =>  {
      navigate('/main/hr-retirement');
  }

  return (
    <Container>
      <MessageBox text="퇴직 정보 검토"/>

      <FlexboxGrid justify="center" align="middle" style={{ minHeight: "70vh", marginTop: 30, marginBottom: 50 }}>
        <FlexboxGrid.Item colspan={20} style={{ maxWidth: 700, width: "100%" }} >
          <Panel header={<div>📄 퇴직 정보 검토</div>} bordered style={{ background: "#fff" }} >
            <Form fluid model={model} formValue={retiData}    // => formValue={retiData} 에서 값을 전달받으므로 개별 value={...}를 사용안해도 됨
              onChange={setRetiData} onCheck={setFormError} style={{ width: 800 }} >
              <Grid fluid>
                
                <Row>
                  <Col xs={20}>
                    <Form.Group controlId="e_name">
                      <Form.ControlLabel>사원명</Form.ControlLabel>
                      <Form.Control
                        name="e_name"
                        readOnly
                        disabled
                        style={{ width: '100%', marginBottom: "20px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row gutter={16} >
                  <Col xs={10}>
                    <Form.Group controlId="d_name">
                      <Form.ControlLabel>부서명</Form.ControlLabel>
                      <Form.Control
                        name="d_name"
                        readOnly
                        disabled
                      />
                    </Form.Group>
                  </Col>
                    
                  <Col xs={10}>
                    <Form.Group controlId="e_position">
                      <Form.ControlLabel>직위</Form.ControlLabel>
                      <Form.Control
                        name="e_position"
                        readOnly
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row style={{ marginTop: 20 }}>
                  <Col xs={6.5}>
                    <Form.Group controlId="re_app_date">
                      <Form.ControlLabel>퇴사 신청일</Form.ControlLabel>
                      <Form.Control
                        name="re_app_date"
                        accepter={DatePicker}
                        format="yyyy-MM-dd"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={6.5}>
                    <Form.Group controlId="re_date">
                      <Form.ControlLabel>퇴사 예정일</Form.ControlLabel>
                      <Form.Control
                        name="re_date"
                        accepter={DatePicker}
                        format="yyyy-MM-dd"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={6}>
                    <Form.Group controlId="re_last_working_date">
                      <Form.ControlLabel>마지막 근무일</Form.ControlLabel>
                      <Form.Control
                        name="re_last_working_date"
                        accepter={DatePicker}
                        format="yyyy-MM-dd"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 20 }}>
                  <Col xs={10}>
                    <Form.Group controlId="re_type">
                      <Form.ControlLabel>퇴직 유형</Form.ControlLabel>
                      <SelectPicker
                        name="re_type"
                        data={type}
                        value={retiData.re_type}
                        onChange={(value) =>
                          setRetiData({ ...retiData, re_type: value })
                        }
                        style={{ width: "100%" }}
                        placeholder="선택하세요"
                        cleanable={false}
                      />
                    </Form.Group>
                    
                    <Form.Group controlId="re_succession_yn">
                      <Form.ControlLabel>인수인계 여부</Form.ControlLabel>
                      <Form.Control
                        name="re_succession_yn"
                        accepter={RadioGroup}
                        inline
                      >
                        <Radio value="Y">Y</Radio>
                        <Radio value="N">N</Radio>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col xs={10}>                    
                    <Form.Group controlId="re_approval_status">
                      <Form.ControlLabel>승인 상태</Form.ControlLabel>
                      <SelectPicker
                        name="re_approval_status"
                        data={approvalStatus}
                        value={retiData.re_approval_status}
                        onChange={(value) =>
                          setRetiData({ ...retiData, re_approval_status: value })
                        }
                        style={{ width: "100%" }}
                        placeholder="선택하세요"
                        cleanable={false}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{ marginTop: 20 }}>
                  <Col xs={20}>
                    <Form.Group controlId="re_request_reason">
                      <Form.ControlLabel>퇴직 사유</Form.ControlLabel>
                      <Form.Control name="re_request_reason" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{ marginTop: 20 }}>
                  <Col xs={20}>
                    <Form.Group controlId="re_note">
                      <Form.ControlLabel>결재 사유</Form.ControlLabel>
                      <Form.Control name="re_note" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{ marginTop: 20 }}>
                  <Col xs={24} style={{ textAlign: "center" }}>
                    <ButtonToolbar>
                      <Button appearance="ghost" style={{ color: "#22284c", border: "1px solid #22284c" }} onClick={retiList}>목록</Button>
                      <Button appearance="ghost" color="blue" onClick={updateReti}>저장</Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Grid>
            </Form>

          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Container>
  );
}
