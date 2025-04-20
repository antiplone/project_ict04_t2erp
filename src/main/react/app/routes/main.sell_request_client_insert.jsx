import React, { useState } from "react";
import { Form, Input, ButtonToolbar, Button, Message, FlexboxGrid,
        Panel, Divider, Grid, Row, Col, toaster } from "rsuite";
import { useDaumPostcodePopup } from "react-daum-postcode";
import "#styles/sell.css";
import AppConfig from "#config/AppConfig.json";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
Textarea.displayName = "Textarea";

const SellRequestClient = () => {

  const fetchURL = AppConfig.fetch["mytest"];

  const [clientAdd, setClientAdd] = useState({
    sc_req_d_name: "",
    sc_client_name: "",
    sc_ceo: "",
    c_biz_num: "",
    sc_email_front: "", // 첫번째 빈칸 (이메일 앞부분)
    sc_email_back: "",  // 두번째 빈칸 (이메일 뒷부분)
    sc_tel: "",
    zone_code: "",
    base_address: "",
    detail_address: "",
    sc_type: "",
    sc_industry: "",
    sc_note: "",
  });

    const changeValue = (value, name) => {
      setClientAdd(prev => ({
        ...prev,
        [name]: value
      }));
    };

    
    const [isBizNumChecked, setIsBizNumChecked] = useState(false);  // 중복 체크 여부
    const [isBizNumValid, setIsBizNumValid] = useState(false);      // 중복 결과 여부

    // 사업자 등록번호 중복 체크
    const bizNumCheck = (c_biz_num) => {
        if (!c_biz_num.trim()) {
            alert("사업자등록번호를 입력해주세요.");
            return;
        }

        // 형식 검사 (사업자등록번호는 XXX-XX-XXXXX 형식)
        const bizNumPattern = /^\d{3}-\d{2}-\d{5}$/;
        if (!bizNumPattern.test(c_biz_num)) {
            alert("사업자등록번호 형식이 올바르지 않습니다. \n (예시: 123-45-67890)");
            return;
        }

        fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientBizNum/` + c_biz_num, {
            method: 'GET',
        })
        .then((res) => res.text())
        .then((res) => {
            setIsBizNumChecked(true); // 체크는 했음
            console.log("사업자등록번호 중복 체크 URL:", `${fetchURL.protocol}${fetchURL.url}/sell/reqClientBizNum/` + c_biz_num);
            if (res != 0) {
                alert('이미 등록되어 있습니다. 재확인 후 입력해주세요.');
                setClientAdd({
                    ...clientAdd,
                    c_biz_num: ""
                });
                setIsBizNumValid(false);
            } else {
                alert('등록 가능한 사업자등록번호입니다.');
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
    c_biz_num: "사업자등록번호",
    sc_email_front: "이메일",
    sc_email_back: "이메일",
    sc_tel: "연락처",
    zone_code: "우편번호",
    base_address: "기본 주소",
    sc_type: "업태",
    sc_industry: "업종",
    sc_req_d_name: "요청 부서"
    };
    
  const submitclientAdd = () => {
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

    // 정상일 경우 진행
    fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientInsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(finalClientAdd)
    })
      .then((res) => {
        if (res.status === 201) return res.json();
        else return null;
      })
      .then((res) => {
        if (res === 1) {
          alert("등록이 완료되었습니다.");
          window.location.reload();
        } else {
          alert("등록에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.log("실패", error);
      });
  };

  return (
    <FlexboxGrid style={{ marginTop: 30, marginLeft: 20, marginBottom: 50 }}>
        <FlexboxGrid.Item 
            colspan={20} 
            style={{
                maxWidth: 700, width: "100%"
            }}
        >
        <Panel
          header={<h4>📝 거래처 등록 요청</h4>}
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
                      onChange={(value) =>
                        changeValue(value, "sc_client_name")
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>대표자명</Form.ControlLabel>
                    <Form.Control
                      name="sc_ceo"
                      onChange={(value) => changeValue(value, "sc_ceo")}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>사업자등록번호 
                        <Button appearance="ghost" style={{ marginLeft: 10}} size="xs" onClick={() => bizNumCheck(clientAdd.c_biz_num)}>중복체크</Button>
                    </Form.ControlLabel>
                    <Form.Control
                      name="c_biz_num"
                      value={clientAdd.c_biz_num}
                      onChange={(value) =>
                        changeValue(value, "c_biz_num")
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
                      onChange={(value) => changeValue(value, "zone_code")}
                      // value={setUserZoneCode} // 우편번호
                    />
                    <Form.Control
                      name="base_address"
                      value={clientAdd.base_address}
                      onChange={(value) => changeValue(value, "base_address")}  // 검색 후 나온 풀 주소
                    />
                    <Form.Control
                      name="detail_address"
                      onChange={(value) => changeValue(value, "detail_address")}  // 추가 입력한 주소
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>업태</Form.ControlLabel>
                    <Form.Control
                      name="sc_type"
                      onChange={(value) => changeValue(value, "sc_type")}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.ControlLabel>업종</Form.ControlLabel>
                    <Form.Control
                      name="sc_industry"
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
                    <Button appearance="primary" type="submit" style={{ marginRight: 10 }}>
                      등록 요청
                    </Button>
                    <Button appearance="default">취소</Button>
                  </ButtonToolbar>
                </Col>
              </Row>
            </Grid>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default SellRequestClient;