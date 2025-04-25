import React, { useState, useEffect } from "react";
import { Message, Form, Divider, ButtonToolbar, Button, FlexboxGrid,
    Panel, Grid, Row, Col, Input } from 'rsuite';
import { useParams, useNavigate } from "react-router-dom";
import "#styles/sell.css";
import AppConfig from "#config/AppConfig.json";

const Textarea = React.forwardRef((props, ref) => (
    <Input {...props} as="textarea" ref={ref} />
  ));
  Textarea.displayName = "Textarea";

const sell_request_client_detail = () => {
    const navigate = useNavigate();

    const { sc_id } = useParams();

    const [reqClientList, setReqClientList] = useState([]);
    const [scEmailFront, setScEmailFront] = useState('');   // 이메일 @ 앞
    const [scEmailBack, setScEmailBack] = useState('');     // 이메일 @ 뒤

    const fetchURL = AppConfig.fetch['mytest'];
    const rowData = reqClientList[0] || {}; // 값이 없을 때를 대비해 빈 객체 처리
      
   // fetch()를 통해 톰캣서버에게 데이터를 요청
    useEffect(() => {
        if (!sc_id) return; // undefined 방지

        fetch(`${fetchURL.protocol}${fetchURL.url}/basic/clientApprovalDetail/` + sc_id, {
            method: "GET"
        })
        .then(res => res.json())
        .then(res => {
            setReqClientList([res]);    // 배열로 감싸서 Table에 맞게 넣음
            console.log(res);

            // 이메일이 존재할 경우, @를 기준으로 분리하여 state에 저장
            if (res.sc_email) {
                const [emailFront, emailBack] = res.sc_email.split('@');
                setScEmailFront(emailFront);
                setScEmailBack(emailBack);
            }
        });
    }, [sc_id]);    // sc_id 바뀌면 다시 fetch

    // 리스트로 이동
    const listReqClient = () =>  {
        navigate('/main/basic_client?tab=3');
    }

    return (
        <div>
            <div>
                <Message type="info" className="main_title">
                    거래처 관리 - 상세 정보
                </Message>
            </div>

            <FlexboxGrid style={{ marginTop: 30, marginLeft: 10, marginBottom: 50 }}>
      <FlexboxGrid.Item
        colspan={20}
        style={{
          maxWidth: 700, width: "100%"
        }}
      >
        <Panel
          header={<h4>📄 거래처 요청 정보 상세 조회</h4>}
          bordered
          style={{ background: "#fff" }}
        >
          <Form fluid>
            <Grid fluid>
              <Row gutter={16}>
                <Col xs={12}>
                  <Form.Group>
                    <Form.ControlLabel>거래처명</Form.ControlLabel>
                    <Form.Control
                      name="sc_client_name"
                      value={rowData.sc_client_name || ''}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>대표자명</Form.ControlLabel>
                    <Form.Control
                      name="sc_ceo"
                      value={rowData.sc_ceo || ''}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>사업자등록번호</Form.ControlLabel>
                    <Form.Control
                      name="c_biz_num"
                      value={rowData.c_biz_num || ''}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>이메일</Form.ControlLabel>
                    <Grid fluid>
                      <Row gutter={16} align="middle">
                        <Col xs={11}>
                          <Form.Control
                            name="sc_email_front"
                            value={scEmailFront || ''}
                            readOnly
                          />
                        </Col>
                        <Col xs={2} style={{ textAlign: "center", lineHeight: "38px" }}>
                          @
                        </Col>
                        <Col xs={11}>
                          <Form.Control
                            name="sc_email_back"
                            value={scEmailBack || ''}
                            readOnly
                          />
                        </Col>
                      </Row>
                    </Grid>
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.ControlLabel>연락처</Form.ControlLabel>
                    <Form.Control
                      name="sc_tel"
                      value={rowData.sc_tel || ''}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>주소</Form.ControlLabel>
                    <Form.Control
                      name="zone_code"
                      value={rowData.zone_code || ''}
                      readOnly
                    />
                    <Form.Control
                      name="base_address"
                      value={rowData.base_address || ''}
                      readOnly
                    />
                    <Form.Control
                      name="detail_address"
                      value={rowData.detail_address || ''}
                      readOnly
                    />

                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>업태</Form.ControlLabel>
                    <Form.Control
                      name="sc_type"
                      value={rowData.sc_type || ''}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>업종</Form.ControlLabel>
                    <Form.Control
                      name="sc_industry"
                      value={rowData.sc_industry || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Divider />

              <Row>
                <Col xs={24}>
                  <Form.Group>
                    <Form.ControlLabel>비고</Form.ControlLabel>
                    <Form.Control
                      rows={5}
                      name="sc_note"
                      accepter={Textarea}
                      value={rowData.sc_note || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <Col xs={24}>
                  <Form.Group>
                    <Form.ControlLabel>요청 부서</Form.ControlLabel>
                    <Form.Control
                      name="sc_req_d_name"
                      value={rowData.sc_req_d_name || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <Col xs={24} style={{ textAlign: "center" }}>
                               <ButtonToolbar style={{ display: "inline-block" }}>
                    <Button style={{ marginRight: 10}} onClick={() => listReqClient()} appearance="ghost" >목록</Button>
                  </ButtonToolbar>
                </Col>
              </Row>
            </Grid>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
    </div>
  );
};

export default sell_request_client_detail;