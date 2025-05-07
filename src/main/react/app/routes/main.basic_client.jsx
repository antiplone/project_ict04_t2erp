import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from 'react';
import { Message, Form, Divider, ButtonToolbar, Button, FlexboxGrid, Panel, Grid, Row, Col, Input, Tabs, Placeholder, Checkbox, SelectPicker, Loader } from 'rsuite';
import { useNavigate, useLocation  } from "@remix-run/react";
import MessageBox from '#components/common/MessageBox';
import { HrTable } from '#components/hr/HrTable';
import { Link } from '@remix-run/react';
import { useDaumPostcodePopup } from 'react-daum-postcode';     // 다음 우편번호 api 커스텀 훅, 다음 우편번호 팝업을 띄우는 기능 제공
import HrRadio from '#components/hr/HrRadio.jsx';
import { useToast } from '#components/common/ToastProvider';
import { CheckButton } from "#components/hr/HrButton";
import { formatDate } from "#components/hr/HrDate";

// textarea용 커스텀 컴포넌트
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
Textarea.displayName = "Textarea";

export default function Basic_client() {
  const fetchURL = AppConfig.fetch["mytest"];
  const basicURL = `${fetchURL.protocol}${fetchURL.url}/basic`;

  const [clients, setClients] = useState([]);
  const [requestClients, setRequestClients] = useState([]);
  const { showToast } = useToast();
  const [isBizNumChecked, setIsBizNumChecked] = useState(false);
  const [isBizNumValid, setIsBizNumValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    client_name: '',
    c_ceo: '',
    c_biz_num: '',
    c_email: '',
    c_tel: '',
    c_zone_code: '',
    c_base_address: '',
    c_detail_address: '',
    c_type: '',
    c_industry: '',
    c_status: 'Y',
    c_note: ''
  });

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || '1';

  const [activeTab, setActiveTab] = useState(initialTab);

  // 다음 우편번호 api
  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");     // open() 함수 만들어줌

  const handleClick = () => {             // 우편번호 검색 버튼을 눌렀을 때 실행되는 함수
    open({                                 
      onComplete: (data) => {             // onComplete 사용자가 주소 선택하면 함수 실행
        let baseAddress = data.address;   // 기본 주소
        let extraAddress = "";            // 상세 주소

        if (data.addressType === "R") {   // 도로명 주소일 때만 실행됨
          if (data.bname !== "") extraAddress += data.bname;    // 법정동 명칭이나 건물 이름이 있으면 extraAddress에 붙임
          if (data.buildingName !== "") {
            extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;   // 건물 이름이 있다면, 그걸 extraAddress에 추가하는데, 이미 다른 내용이 있으면 앞에 쉼표(,)를 붙여서 추가
          }
          baseAddress += extraAddress !== "" ? ` (${extraAddress})` : "";     // baseAddress에 ()안에 부가정보 붙임
        }

        setForm((prevForm) => ({        // 기존 form 값은 그대로 두고 우편번호, 기본주소 값을 새로 설정
          ...prevForm,
          c_zone_code: data.zonecode,
          c_base_address: baseAddress,
          c_detail_address: ""        // 새로 입력 받기 위해 빈 문자열로 초기화
        }));
      }
    });
  };

  // 거래처 목록
  useEffect(() => {
    setLoading(true);
    fetch(`${basicURL}/client`)
      .then(response => response.json())
      .then(data => {
        const processedData = data.map(client => ({
          ...client,
          c_email: client.c_email?.trim() || '-'  // 이메일 없으면 '-'로 대체
        }));
        setClients(processedData);
      })
      .catch(error => console.error("데이터를 불러오지 못했습니다:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = () => {

    // 중복확인 후 등록
    if (!isBizNumValid) {
      showToast("사업자등록번호 중복체크를 먼저 해주세요.", "warning");
      return;
    }

    const requiredFields = [
      { key: "client_name", label: "거래처명" },
      { key: "c_ceo", label: "대표자명" },
      { key: "c_biz_num", label: "사업자등록번호" },
      { key: "c_tel", label: "연락처" },
      { key: "c_zone_code", label: "우편번호" },
      { key: "c_base_address", label: "기본주소" },
    ];
  
    const emptyFields = requiredFields.filter(field => !form[field.key]?.trim());
  
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(f => f.label).join(", ");
      alert(`다음 항목을 입력해주세요: ${fieldNames}`);
      return;
    }

    const finalForm = {
      ...form,
      c_email: form.c_email_front && form.c_email_back
        ? `${form.c_email_front}@${form.c_email_back}`
        : ''
    };

    console.log("전송 데이터 확인:", form)
  
    // 거래처 등록
    fetch(`${basicURL}/clientInsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalForm)
    })
      .then(res => res.text())
      .then(result => {
        console.log("등록 응답값:", result);
        if (result === "1") {
          showToast('거래처가 등록되었습니다.', "success");
          setForm({
            client_name: '',
            c_ceo: '',
            c_biz_num: '',
            c_email: '',
            c_tel: '',
            c_zone_code: '',
            c_base_address: '',
            c_detail_address: '',
            c_type: '',
            c_industry: '',
            c_status: '',
            c_note: ''
          });

          // 등록 후 목록 다시 불러오고, 탭 전환
          fetch(`${basicURL}/client`)
            .then(response => response.json())
            .then(data => {
              setClients(data);
              setActiveTab("1"); // 목록 탭으로 이동 
            });
        } else {
          alert('등록 실패');
        }
      });
  };

  const [visibleRequests, setVisibleRequests] = useState([]);

  // 거래처 요청 목록
  useEffect(() => {
    fetch(`${basicURL}/clientApproval`)
      .then(res => res.json())
      .then(data => {
        setRequestClients(data); // 전체는 여기에 저장
        setVisibleRequests(data.filter(item => item.sa_approval_status === "진행중"));    // 진행중 상태인 요청만 보이도록
      });
  }, []);

  const columns = [
    { label: "거래처 코드", dataKey: "client_code", width: 165 },
    { label: "거래처명", dataKey: "client_name", width: 240 },
    { label: "대표자명", dataKey: "c_ceo", width: 180 },
    { label: "사업자등록번호", dataKey: "c_biz_num", width: 220 },
    { label: "이메일", dataKey: "c_email", width: 310 },
    { label: "거래처 연락처", dataKey: "c_tel", width: 230 },
    { label: "사용 상태", dataKey: "c_status", width: 165 },
    {
      label: "등록일",
      dataKey: "c_reg_date",
      width: 220,
      renderCell: (rowData) => formatDate(rowData.c_reg_date)
    }
  ];
  
  const requestColumns = [
    { label: "순번", dataKey: "sc_id", width: 85 },
    { label: "거래처명", dataKey: "sc_client_name", width: 165 },
    { label: "대표자명", dataKey: "sc_ceo", width: 150 },
    { label: "사업자등록번호", dataKey: "sc_biz_num", width: 180 },
    { label: "이메일", dataKey: "sc_email", width: 210 },
    { label: "연락처", dataKey: "sc_tel", width: 165 },
    {
      label: "비고",
      dataKey: "sa_approval_comment",
      width: 250,
      renderCell: (rowData, rowIndex) => (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '100%' }}>
          <Input
            key={rowData.sc_id}
            size="sm"
            defaultValue={rowData.sa_approval_comment || ""}      // value, onChange로 구성된 컴포넌트를 쓸 경우 한글 조합이 깨지는 문제가 발생(입력 중에 리렌더링)
            onBlur={(e) => {                                      // defaultValue는 조합 끝난 후 onBlur로 한 번에 저장
              const updated = [...requestClients];
              updated[rowIndex].sa_approval_comment = e.target.value;
              setRequestClients(updated);
            }}
            style={{ width: '100%' }}
          />
        </div>
      )
    },
    {
      label: "등록일",
      dataKey: "sc_date",
      width: 160,
      renderCell: (rowData) => formatDate(rowData.sc_date)
    },
    {
      label: "승인상태",
      dataKey: "sa_approval_status",
      width: 160,
      renderCell: (rowData, rowIndex) => (
        <div style={{ padding: '4px', height: '100%', display: 'flex', alignItems: 'center' }}>
          <SelectPicker
            searchable={false}
            data={[
              { label: "진행중", value: "진행중" },
              { label: "승인", value: "승인" },
              { label: "반려", value: "반려" }
            ]}
            value={rowData.sa_approval_status}     // 현재 셀렉트 박스에 선택되어 있는 값
            onChange={(val) => {                   // 셀렉트 박스에서 값을 바꿨을 때 실행
              const updated = [...requestClients]; // 전체 목록 데이터
              const target = updated.find(item => item.sc_id === rowData.sc_id);    // 수정할 대상을 requestClients에서 찾음, find() 배열 안에서 조건에 맞는 첫번째 요소 하나를 찾아주는 메서드
              if (target) target.sa_approval_status = val;          // 해당하는 행이 있으면 sa_approval_status 값을 바꿔줌
              setRequestClients(updated);          // 수정한 복사본을 다시 저장
            }}
            placeholder="선택"
            cleanable={false}
            style={{ width: '90px' }}
            menuStyle={{ zIndex: 9999 }}      // 다른 요소보다 뒤에 뜨게
            size="sm"
          />
        </div>
      )
    }
  ];

  // 거래처 요청 탭 - 요청 처리 버튼 눌렀을 때 실행
  function handleApproval(rowData) {            // 요청 처리 시 해당 계정의 사번과 이름, 거래처 정보 자동 update, insert
    const e_id = localStorage.getItem("e_id");    // localStorage에 저장된 사번, 이름 가져오기
    const e_name = localStorage.getItem("e_name");
  
    if (!e_id || !e_name) {
      alert("로그인 정보가 없습니다.");
      return;
    }
  
    const payload = {
      sc_id: rowData.sc_id,
      sc_client_name: rowData.sc_client_name,
      sc_ceo: rowData.sc_ceo,
      sc_biz_num: rowData.sc_biz_num,
      sc_email: rowData.sc_email,
      sc_tel: rowData.sc_tel,
      zone_code: rowData.zone_code,
      base_address: rowData.base_address,
      detail_address: rowData.detail_address,
      sc_type: rowData.sc_type,
      sc_industry: rowData.sc_industry,
      sc_note: rowData.sc_note,
      sa_e_id: e_id,
      sa_app_e_name: e_name,
      sa_approval_comment: rowData.sa_approval_comment || "",
      sa_approval_status: rowData.sa_approval_status || "진행중"
    };
  
    // 거래처 수정
    fetch(`${basicURL}/clientApprovalUpdate/${rowData.sc_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("승인 요청 실패");
        }
        return response.text();
      })
      .then(result => {
        showToast("요청 처리가 완료되었습니다.", "success");
      
        // 전체 목록에서 삭제
        setRequestClients(prev => prev.filter(item => item.sc_id !== rowData.sc_id));
      
        // 보이는 목록에서도 삭제
        setVisibleRequests(prev => prev.filter(item => item.sc_id !== rowData.sc_id));
      
        // 거래처 목록도 새로고침
        fetch(`${basicURL}/client`)
          .then(res => res.json())
          .then(data => setClients(data));
      })

  }

  // 요청 받은 당시 정보 저장
  const mergedData = visibleRequests.map(req => {
    const base = requestClients.find(item => item.sc_id === req.sc_id);
    return {
      ...base,  // 요청 당시 전체 정보
      sa_approval_comment: req.sa_approval_comment ?? base?.sa_approval_comment ?? "",
      sa_approval_status: req.sa_approval_status ?? base?.sa_approval_status ?? "진행중"
    };
  });
  

  return (
    <div style={{ borderRadius: '10px' }}>
      <MessageBox type="info" text="기초 등록 - 거래처 관리" />

      <Tabs activeKey={activeTab} onSelect={setActiveTab} style={{ marginBottom: '30px' }}>   {/* setActiveTab 등록 성공시 거래처 목록으로 탭 전환 */}
        <Tabs.Tab eventKey="1" title="거래처 목록">
        <div style={{ minHeight: 400, position: 'relative' }}>
          {loading ? (
            <>
              <Placeholder.Paragraph rows={14} />
              <Loader center content="불러오는 중..." />
            </>
          ) : (
            <HrTable
              columns={columns}
              items={clients}
              renderActionButtons={(rowData) => (
                <Link to={`/main/basic_client_detail/${rowData.client_code}`}>
                  <Button appearance='ghost' size='xs' color='green'>
                    조회
                  </Button>
                </Link>
              )}
            />
          )}
        </div>  
        </Tabs.Tab>

        <Tabs.Tab eventKey="2" title="거래처 등록">
          <FlexboxGrid style={{ marginTop: 30, marginLeft: 10, marginBottom: 50 }}>
            <FlexboxGrid.Item colspan={20} style={{ maxWidth: 700, width: "100%" }}>
              <Panel header={<h4>📄 거래처 등록</h4>} bordered style={{ background: "#fff" }}>
                <Form fluid>
                  <Grid fluid>
                    <Row gutter={16}>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.ControlLabel>거래처명 *</Form.ControlLabel>
                          <Form.Control name="client_name" value={form.client_name}
                            onChange={(val) => setForm({ ...form, client_name: val })} />
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>대표자명 *</Form.ControlLabel>
                          <Form.Control name="c_ceo" value={form.c_ceo}
                            onChange={(val) => setForm({ ...form, c_ceo: val })} />
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>사업자등록번호 *
                          <CheckButton 
                            bizNum={form.c_biz_num} 
                            onResult={(isValid) => {
                              setIsBizNumChecked(true);
                              setIsBizNumValid(isValid);

                              if (!isValid) {
                                setForm(prev => ({ ...prev, c_biz_num: "" }));
                              }
                            }}
                          />
                          </Form.ControlLabel>
                          <Form.Control name="c_biz_num" value={form.c_biz_num}
                            onChange={(val) => setForm({ ...form, c_biz_num: val })} />
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>연락처 *</Form.ControlLabel>
                          <Form.Control name="c_tel" value={form.c_tel}
                            onChange={(val) => setForm({ ...form, c_tel: val })} />
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>이메일</Form.ControlLabel>
                          <Grid fluid>
                            <Row gutter={16} align="middle">
                              <Col xs={11}>
                                <Form.Control
                                  name="c_email_front"
                                  value={form.c_email_front}
                                  onChange={(val) => setForm({ ...form, c_email_front: val })}
                                />
                              </Col>
                              <Col xs={2} style={{ textAlign: "center", lineHeight: "38px" }}>@</Col>
                              <Col xs={11}>
                                <Form.Control
                                  name="c_email_back"
                                  value={form.c_email_back}
                                  onChange={(val) => setForm({ ...form, c_email_back: val })}
                                />
                              </Col>
                            </Row>
                          </Grid>
                      </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                        <Form.ControlLabel>
                          주소 *
                          <Button 
                            appearance="ghost" 
                            style={{ marginLeft: 10 }}
                            size="xs" 
                            onClick={handleClick}
                          >
                            우편번호 검색
                          </Button>
                        </Form.ControlLabel>
                          <Form.Control name="c_zone_code" value={form.c_zone_code}
                            onChange={(val) => setForm({ ...form, c_zone_code: val })}
                            style={{ marginBottom: '8px' }} />
                          <Form.Control name="c_base_address" value={form.c_base_address}
                            onChange={(val) => setForm({ ...form, c_base_address: val })}
                            style={{ marginBottom: '8px' }} />
                          <Form.Control name="c_detail_address" value={form.c_detail_address}
                            onChange={(val) => setForm({ ...form, c_detail_address: val })} />
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>업종</Form.ControlLabel>
                          <Form.Control name="c_industry" value={form.c_industry}
                            onChange={(val) => setForm({ ...form, c_industry: val })} />
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>업태</Form.ControlLabel>
                          <Form.Control name="c_type" value={form.c_type}
                            onChange={(val) => setForm({ ...form, c_type: val })} />
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>사용 상태 *</Form.ControlLabel>
                          <HrRadio
                            value={form.c_status === 'Y' ? '사용중' : '사용안함'}   // Y/N → 라벨로 변환
                            onChange={(val) =>
                              setForm({ ...form, c_status: val === '사용중' ? 'Y' : 'N' })  // 라벨 → Y/N 변환
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
                            value={form.c_note}
                            onChange={(val) => setForm({ ...form, c_note: val })}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row style={{ marginTop: 20 }}>
                      <Col xs={24} style={{ textAlign: "center" }}>
                        <ButtonToolbar>
                          <Button appearance="ghost" onClick={handleRegister}>등록</Button>
                        </ButtonToolbar>
                      </Col>
                    </Row>
                  </Grid>
                </Form>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Tabs.Tab>


        <Tabs.Tab eventKey="3" title="거래처 요청">
          <div
          >
            <HrTable
              columns={requestColumns}
              items={mergedData}
              renderActionButtons={(rowData) => (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                  <Link to={`/main/basic_client_approval_detail/${rowData.sc_id}`}>
                    <Button appearance='ghost' size='xs' color='green'>
                      조회
                    </Button>
                  </Link>
                  <Button
                    appearance="ghost"
                    size="xs"
                    onClick={() => handleApproval(rowData)}
                  >
                    요청 처리
                  </Button>
                </div>
              )}
            />

          </div>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}