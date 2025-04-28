import React, { useState, useEffect } from "react";
import { Message, Form, Divider, ButtonToolbar, Button, FlexboxGrid,
    Panel, Grid, Row, Col, Input, toaster } from 'rsuite';
import { useParams, useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";
import "#styles/sell.css";
import AppConfig from "#config/AppConfig.json";

// sell_request_update_client/{sc_id} => 거래처 등록 요청건 수정페이지


const Textarea = React.forwardRef((props, ref) => (
    <Input {...props} as="textarea" ref={ref} />
  ));
  Textarea.displayName = "Textarea";

  const SellRequestUpdateClient = () => {
    const navigate = useNavigate();
    const { sc_id } = useParams(); // URL에서 /sell/reqClientDetail/:sc_id 가져오기

    const [clientAdd, setClientAdd] = useState({
        sc_client_name: '',
        sc_ceo: '',
        sc_biz_num: '',
        sc_email_front: '',
        sc_email_back: '',
        sc_tel: '',
        zone_code: '',
        base_address: '',
        detail_address: '',
        sc_type: '',
        sc_industry: '',
        sc_status: '',
        sc_note: '',
        sc_req_d_name: '',
    });

    const [rowData, setRowData] = useState({}); // 서버에서 가져온 데이터
    const fetchURL = AppConfig.fetch['mytest'];

    // 내역 조회 - fetch()를 통해 톰캣서버에게 데이터를 요청
    useEffect(() => {
        if (!sc_id) return; // undefined 방지

        fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientDetail/` + sc_id, {
            method: "GET"
        })
        .then(res => res.json())
        .then(res => {
            if (res.sc_email) {
                const [emailFront, emailBack] = res.sc_email.split('@');
                setClientAdd({
                    sc_client_name: res.sc_client_name,
                    sc_ceo: res.sc_ceo,
                    sc_biz_num: res.sc_biz_num,
                    sc_email_front: emailFront,
                    sc_email_back: emailBack,
                    sc_tel: res.sc_tel,
                    zone_code: res.zone_code,
                    base_address: res.base_address,
                    detail_address: res.detail_address,
                    sc_type: res.sc_type,
                    sc_industry: res.sc_industry,
                    sc_note: res.sc_note,
                    sc_req_d_name: res.sc_req_d_name,
                });
            }
        });
    }, [sc_id]);  // sc_id 바뀌면 다시 fetch

    // rowData가 변경될 때마다 clientAdd를 업데이트하는 effect 추가
    useEffect(() => {
        if (Object.keys(rowData).length > 0) {
            setClientAdd(prev => ({
              ...prev,
                sc_client_name: rowData.sc_client_name || '',
                sc_ceo: rowData.sc_ceo || '',
                sc_biz_num: rowData.sc_biz_num || '',
                sc_email_front: rowData.sc_email ? rowData.sc_email.split('@')[0] : '',
                sc_email_back: rowData.sc_email ? rowData.sc_email.split('@')[1] : '',
                sc_tel: rowData.sc_tel || '',
                zone_code: rowData.zone_code || '',
                base_address: rowData.base_address || '',
                detail_address: rowData.detail_address || '',
                sc_type: rowData.sc_type || '',
                sc_industry: rowData.sc_industry || '',
                sc_note: rowData.sc_note || '',
                sc_req_d_name: rowData.sc_req_d_name || '',
                // sc_status: rowData.sc_status || ''
            }));
        }
    }, [rowData]);  // rowData가 변경되면 clientAdd를 업데이트

    const changeValue = (value, name) => {
      setClientAdd(prev => ({
        ...prev,
        [name]: value
    }));
    }

    const [isBizNumChecked, setIsBizNumChecked] = useState(false);  // 중복 체크 여부
    const [isBizNumValid, setIsBizNumValid] = useState(false);      // 중복 결과 여부

    // 사업자 등록번호 중복 체크
    const bizNumCheck = (sc_biz_num) => {
        if (!sc_biz_num.trim()) {
             toaster.push(
                <Message showIcon type="warning" closable >
                  사업자등록번호를 입력해주세요.
                </Message>,
                { placement: "topCenter" }
              );
            return;
        }

        // 형식 검사 (사업자등록번호는 XXX-XX-XXXXX 형식)
        const bizNumPattern = /^\d{3}-\d{2}-\d{5}$/;
        if (!bizNumPattern.test(sc_biz_num)) {
            toaster.push(
              <Message showIcon type="warning" closable >
                사업자등록번호 형식이 올바르지 않습니다. <br />
                (예시: 123-45-67890)
              </Message>,
              { placement: "topCenter" }
            );
            return;
        }

        fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientBizNum/` + sc_biz_num, {
            method: 'GET',
        })
        .then((res) => res.text())
        .then((res) => {
            setIsBizNumChecked(true); // 체크는 했음
            if (res != 0) {
                toaster.push(
                  <Message showIcon type="warning" closable >
                    사업자등록번호 형식이 올바르지 않습니다. <br />
                    (예시: 123-45-67890)
                  </Message>,
                  { placement: "topCenter" }
                );
                setClientAdd({
                    ...clientAdd,
                    sc_biz_num: ""
                });
                setIsBizNumValid(false);
            } else {
                toaster.push(
                  <Message showIcon type="success" closable >
                    등록 가능한 사업자등록번호입니다.
                  </Message>,
                  { placement: "topCenter" }
                );
                setIsBizNumValid(true);
            }
        });
    }

    //다음 우편번호 찾기 API사용
    const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      const open = useDaumPostcodePopup(scriptUrl);

      const handleComplete = (data) => {
        let baseAddress = data.address;
        let extraAddress = "";
        let Addresszonecode = data.zonecode;

        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          baseAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        changeValue(baseAddress, "base_address");
        changeValue(Addresszonecode, "zone_code");
      };

      const handleClick = () => {
        open({ onComplete: handleComplete });
      };

    // 이메일 합쳐서 백엔드로 전송할 때 처리
    const getFullEmail = () => {
        return `${clientAdd.sc_email_front}@${clientAdd.sc_email_back}`;
    };

    // 필수 항목 모두 채워졌는지 확인
    const requiredFields = {
        sc_client_name: "거래처명",
        sc_ceo: "대표자명",
        sc_biz_num: "사업자등록번호",
        sc_email_front: "이메일",
        sc_email_back: "이메일",
        sc_tel: "연락처",
        zone_code: "우편번호",
        base_address: "기본 주소",
        sc_type: "업태",
        sc_industry: "업종",
        sc_req_d_name: "요청 부서"
    };

    // 수정처리
    const submitclientAdd = (e) => {
        // 중복 체크가 완료되지 않았을 경우 등록을 막음
        if (!isBizNumValid) {
        toaster.push(
            <Message showIcon type="warning">
              사업자등록번호 중복체크를 먼저 해주세요.
            </Message>,
            { placement: "topCenter" }
        );
        return; // 중복 체크가 안되면 등록하지 않음
        }

    // 리스트로 이동
    const listReqClient = () =>  {
      navigate('/main/sell_request_client_list/');
    }

    // 빈 칸 체크
    const emptyFields = Object.entries(requiredFields).filter(([key]) => {
        return clientAdd[key].trim() === "";
      });

    if (emptyFields.length > 0) {
        const fieldNames = emptyFields.map(([_, label]) => label).join(", ");
        toaster.push(
            <Message showIcon type="warning">
                다음 항목을 입력해주세요!<br />
                : {fieldNames}
            </Message>,
            { placement: "topCenter" }
        );
        return;
    }
  
      const finalClientAdd = {
          ...clientAdd,
          sc_email: getFullEmail()  // 이메일을 합쳐서 최종 값으로 설정
      };
  
      e.preventDefault();
      console.log("폼 제출됨! 데이터:", finalClientAdd);
  
      fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientUpdate/` + sc_id, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify(finalClientAdd)
      })
      .then((res) => {
          if (res.status === 200) return res.json();
          else return null;
      })
      .then((res) => {
          if (res !== 0) {
              toaster.push(
                <Message showIcon type="success" closable>
                  수정이 완료되었습니다.
                </Message>,
                { placement: "topCenter" }
              );

              navigate("/main/sell_request_client_list");
          } else {
              toaster.push(
                <Message showIcon type="error" closable>
                  수정에 실패했습니다.
                </Message>,
                { placement: "topCenter" }
              );
          }
      })
      .catch(error => {
          toaster.push(
            <Message showIcon type="error" closable>
              서버에 오류가 발생했습니다.
            </Message>,
            { placement: "topCenter" }
          );
      });
  }

    // 리스트로 이동
    const listReqClient = () =>  {
        navigate('/main/sell_request_client_list/');
    }
    return (
        <div>
            <div>
                <Message type="info" className="main_title">
                    거래처 관리_수정
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
                  header={<h4>📝 거래처 등록 요청건 수정</h4>}
                  bordered
                  style={{ background: "#fff" }}
                >
                  <Form fluid onSubmit={submitclientAdd}>
                    <Grid fluid>
                      <Row gutter={16}>
                        <Col xs={12}>
                          <Form.Group>
                            <Form.ControlLabel>거래처명</Form.ControlLabel>
                            <Form.Control
                              name="sc_client_name"
                              value={clientAdd.sc_client_name}
                              onChange={(value) =>
                                changeValue(value, "sc_client_name")
                              }
                            />
                          </Form.Group>
        
                          <Form.Group>
                            <Form.ControlLabel>대표자명</Form.ControlLabel>
                            <Form.Control
                              name="sc_ceo"
                              value={clientAdd.sc_ceo}
                              onChange={(value) => changeValue(value, "sc_ceo")}
                            />
                          </Form.Group>
        
                          <Form.Group>
                            <Form.ControlLabel>사업자등록번호 
                                <Button appearance="ghost" style={{ marginLeft: 10}} size="xs" onClick={() => bizNumCheck(clientAdd.sc_biz_num)}>중복체크</Button>
                            </Form.ControlLabel>
                            <Form.Control
                              name="sc_biz_num"
                              value={clientAdd.sc_biz_num}
                              onChange={(value) =>
                                changeValue(value, "sc_biz_num")
                              }
                            />
                            
                          </Form.Group>
        
                            <Form.Group>
                                <Form.ControlLabel>이메일</Form.ControlLabel>
                                <Grid fluid>
                                    <Row gutter={16} align="middle">
                                    <Col xs={11}>
                                        <Form.Control
                                        name="sc_email_front"
                                        value={clientAdd.sc_email_front}
                                        onChange={(value) => changeValue(value, "sc_email_front")}
                                        />
                                    </Col>
                                    <Col xs={2} style={{ textAlign: "center", lineHeight: "38px" }}>
                                        @
                                    </Col>
                                    <Col xs={11}>
                                        <Form.Control
                                        name="sc_email_back"
                                        value={clientAdd.sc_email_back}
                                        onChange={(value) => changeValue(value, "sc_email_back")}
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
                              value={clientAdd.sc_tel}
                              onChange={(value) => changeValue(value, "sc_tel")}
                            />
                          </Form.Group>
        
                          <Form.Group>
                            <Form.ControlLabel>
                              주소
                              <Button appearance="ghost" style={{ marginLeft: 10}} size="xs" onClick={handleClick}>
                                우편번호 검색
                              </Button>
                            </Form.ControlLabel>
                            <Form.Control
                              name="zone_code"
                              value={clientAdd.zone_code}
                              onChange={(value) => changeValue(value, "zone_code")} // 우편번호
                            />
                            <Form.Control
                              name="base_address"
                              value={clientAdd.base_address}
                              onChange={(value) => changeValue(value, "base_address")} // 검색 후 나온 풀 주소
                            />
                            <Form.Control
                              name="detail_address"
                              value={clientAdd.detail_address}
                              onChange={(value) => changeValue(value, "detail_address")} // 추가 입력한 주소
                            />
                          </Form.Group>
        
                          <Form.Group>
                            <Form.ControlLabel>업태</Form.ControlLabel>
                            <Form.Control
                              name="sc_type"
                              value={clientAdd.sc_type}
                              onChange={(value) => changeValue(value, "sc_type")}
                            />
                          </Form.Group>
        
                          <Form.Group>
                            <Form.ControlLabel>업종</Form.ControlLabel>
                            <Form.Control
                              name="sc_industry"
                              value={clientAdd.sc_industry}
                              onChange={(value) => changeValue(value, "sc_industry")}
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
                              value={clientAdd.sc_note}
                              onChange={(value) => changeValue(value, "sc_note")}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
        
                      {/* 요청 부서 위치 변경 */}
                      <Row style={{ marginTop: 20 }}>
                        <Col xs={24}>
                          <Form.Group>
                            <Form.ControlLabel>요청 부서</Form.ControlLabel>
                            <Form.Control
                              name="sc_req_d_name"
                              value={clientAdd.sc_req_d_name}
                              onChange={(value) =>
                                changeValue(value, "sc_req_d_name")
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
        
                      <Row style={{ marginTop: 20 }}>
                        <Col xs={24} style={{ textAlign: "center" }}>
                            <ButtonToolbar style={{ display: "inline-block" }}>
                            <Button appearance="primary" onClick={submitclientAdd} style={{ marginRight: 10 }}>수정</Button>
                            <Button appearance="default" onClick={listReqClient}>취소</Button>
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

export default SellRequestUpdateClient;