import React, { useState, useEffect } from "react";
import { Message, Form, Divider, ButtonToolbar, Button, FlexboxGrid, Panel, Grid, Row, Col, Input } from 'rsuite';
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from '#components/common/ToastProvider';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import AppConfig from "#config/AppConfig.json";
import HrRadio from "#components/hr/HrRadio.jsx";


const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
Textarea.displayName = "Textarea";

const BasicClientDetail = () => {
  const fetchURL = AppConfig.fetch['mytest'];
  const basicURL = `${fetchURL.protocol}${fetchURL.url}/basic`;

  const navigate = useNavigate();
  const { client_code } = useParams();
  const { showToast } = useToast();
  const [client, setClient] = useState({});

  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const handleClick = () => {
    open({
      onComplete: (data) => {
        let baseAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
          if (data.bname !== "") extraAddress += data.bname;
          if (data.buildingName !== "") {
            extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          baseAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        setClient((prev) => ({
          ...prev,
          c_zone_code: data.zonecode,
          c_base_address: baseAddress,
          c_detail_address: ""
        }));
      }
    });
  };

  useEffect(() => {
    if (!client_code) return;
    fetch(`${basicURL}/basic_client_detail/${client_code}`)
      .then(res => res.json())
      .then(data => setClient(data))
      .catch(err => console.error("데이터 조회 실패:", err));
  }, [client_code]);

  const handleUpdate = () => {
    fetch(`${basicURL}/clientUpdate/${client_code}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(client)
    })
      .then(res => res.text())
      .then(result => {
        if (result === "success" || result === "1") {
          showToast("거래처 정보가 수정되었습니다.", "success");
          navigate('/main/basic_client'); // 목록으로 이동
        } else {
          alert("수정 실패");
        }
      })
      .catch(err => {
        console.error("수정 요청 실패:", err);
        alert("오류가 발생했습니다.");
      });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("해당 거래처를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    fetch(`${basicURL}/clientDelete/${client_code}`, {
      method: 'DELETE'
    })
      .then(res => res.text())
      .then(result => {
        console.log("삭제 응답값:", result);
        if (result === "success" || result === "ok") {
          showToast("삭제되었습니다.", "success");
          navigate('/main/basic_client');
        } else {
          alert("삭제 실패: " + result);
        }
      })
  };

  const handleList = () => {
    navigate('/main/basic_client');
  };

  const handleChange = (key, val) => {
    setClient(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div>
      <Message type="info" className="main_title">거래처 상세정보</Message>

      <FlexboxGrid style={{ marginTop: 30, marginLeft: 10, marginBottom: 50 }}>
        <FlexboxGrid.Item colspan={20} style={{ maxWidth: 700, width: "100%" }}>
          <Panel header={<h4>📄 거래처 상세 조회</h4>} bordered style={{ background: "#fff" }}>
            <Form fluid>
              <Grid fluid>
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.ControlLabel>거래처명</Form.ControlLabel>
                      <Form.Control name="client_name" value={client.client_name || ''} onChange={(val) => handleChange('client_name', val)} />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>대표자명</Form.ControlLabel>
                      <Form.Control name="c_ceo" value={client.c_ceo || ''} onChange={(val) => handleChange('c_ceo', val)} />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>사업자등록번호</Form.ControlLabel>
                      <Form.Control name="c_biz_num" value={client.c_biz_num || ''} onChange={(val) => handleChange('c_biz_num', val)} readOnly />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>연락처</Form.ControlLabel>
                      <Form.Control name="c_tel" value={client.c_tel || ''} onChange={(val) => handleChange('c_tel', val)} />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>이메일</Form.ControlLabel>
                      <Form.Control name="c_email" value={client.c_email || ''} onChange={(val) => handleChange('c_email', val)} />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.ControlLabel>주소
                      <Button
                        appearance="ghost"
                        size="xs"
                        style={{ marginLeft: 10 }}
                        onClick={handleClick}
                      >
                        우편번호 검색
                      </Button>
                      </Form.ControlLabel>
                      <Form.Control name="c_zone_code" value={client.c_zone_code || ''} onChange={(val) => handleChange('c_zone_code', val)} style={{ marginBottom: '8px' }} />
                      <Form.Control name="c_base_address" value={client.c_base_address || ''} onChange={(val) => handleChange('c_base_address', val)} style={{ marginBottom: '8px' }} />
                      <Form.Control name="c_detail_address" value={client.c_detail_address || ''} onChange={(val) => handleChange('c_detail_address', val)} />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>거래처 유형</Form.ControlLabel>
                      <Form.Control name="c_type" value={client.c_type || ''} onChange={(val) => handleChange('c_type', val)} />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>업종</Form.ControlLabel>
                      <Form.Control name="c_industry" value={client.c_industry || ''} onChange={(val) => handleChange('c_industry', val)} />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>상태 *</Form.ControlLabel>
                      <HrRadio
                        value={client.c_status === 'Y' ? '사용중' : '사용안함'}   // Y/N → 라벨로 변환
                        onChange={(val) =>
                          handleChange('c_status', val === '사용중' ? 'Y' : 'N')   // 라벨 → Y/N 변환
                        }
                        options={['사용중', '사용안함']}
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
                        rows={4}
                        name="c_note"
                        accepter={Textarea}
                        value={client.c_note || ''}
                        onChange={(val) => handleChange('c_note', val)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24}>
                    <Form.Group>
                      <Form.ControlLabel>등록일</Form.ControlLabel>
                      <Form.Control name="c_reg_date" value={client.c_reg_date || ''} onChange={(val) => handleChange('c_reg_date', val)} readOnly />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{ marginTop: 20 }}>
                  <Col xs={24} style={{ textAlign: "center" }}>
                    <ButtonToolbar>
                      <Button 
                        style={{
                          border: '1px solid #22284C',
                          color: '#22284C',
                        }}
                      appearance="ghost" color="green" onClick={handleList}>목록</Button>
                      <Button appearance="ghost" onClick={handleUpdate}>수정</Button>
                      <Button appearance="ghost" color="red" onClick={handleDelete}>삭제</Button>
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

export default BasicClientDetail;
