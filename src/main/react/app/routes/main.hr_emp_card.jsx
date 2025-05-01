import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from 'react';
import {
  Tabs, Input, ButtonToolbar, Button, Panel,
  Grid, Row, Col, Form, Divider, FlexboxGrid, Uploader,
  Loader,
  Placeholder
} from 'rsuite';
import { HrTable } from '#components/hr/HrTable';
import HrDropdown from '#components/hr/HrDropdown';
import HrRadio from '#components/hr/HrRadio';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { Link } from '@remix-run/react';
import MessageBox from '#components/common/MessageBox.jsx';
import { useToast } from '#components/common/ToastProvider';

const HrEmpCardPage = () => {
  const fetchURL = AppConfig.fetch["mytest"];
  const hrURL = `${fetchURL.protocol}${fetchURL.url}/hrCard`;

  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('1');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    e_name: '', e_tel: '', e_position: '', e_status: '', e_email: '',
    e_birth: '', e_entry: '', e_zone_code: '', e_base_address: '', e_detail_address: '', e_photo: '',
    e_salary_account_bank: '', e_salary_account_num: '', e_salary_account_owner: '',
    e_note: '', d_code: ''
  });
  const [deptList, setDeptList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // 인사카드 목록 불러오기
    fetch(`${hrURL}/hrCardList`)
      .then(res => res.json())
      .then(data => setItems(data))
      .finally(() => setLoading(false));

    // 부서 목록 불러오기
    fetch(`${fetchURL.protocol}${fetchURL.url}/hrDept/hrDeptList`)
      .then(res => res.json())
      .then(data => setDeptList(data.map(d => ({ label: d.d_name, value: d.d_code }))));
  }, []);

  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const handleAddress = () => {
    open({
      onComplete: (data) => {
        let baseAddress = data.address;
        let extra = data.bname || '';
        if (data.buildingName) extra += `, ${data.buildingName}`;
        if (extra) baseAddress += ` (${extra})`;
        setForm(prev => ({
          ...prev,
          e_zone_code: data.zonecode,
          e_base_address: baseAddress,
          e_detail_address: ''
        }));
      }
    });
  };

  const handleUpload = (file) => {
    setUploading(true);
  
    // 프리뷰 먼저 보여주기
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result); // base64 preview
    };
    reader.readAsDataURL(file.blobFile);
  
    // 서버에 파일 전송
    const formData = new FormData();
    formData.append('file', file.blobFile);
  
    fetch(`${hrURL}/hrCardPhoto`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.text())
      .then(url => {
        setUploading(false);
        setForm(prev => ({ ...prev, e_photo: url })); // 이건 서버 저장용 URL
      })
      .catch(() => setUploading(false));
  };

  // 인사카드 등록
  const handleRegister = () => {
  const requiredFields = ['e_name', 'e_tel', 'e_birth', 'e_email', 'e_position', 'd_code', 'e_status', 'e_salary_account_bank', 'e_salary_account_num', 'e_salary_account_owner'];
  const hasEmptyRequiredField = requiredFields.some(field => !form[field]);

  if (hasEmptyRequiredField) {
    showToast('필수 항목을 모두 입력해주세요.', 'error');
    return;
  }
  
    fetch(`${hrURL}/hrCardInsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(result => {
        if (result === 1 || result.success) {
          alert('등록 완료');
          setForm({
            e_name: '', e_tel: '', e_position: '', e_status: '', e_email: '',
            e_birth: '', e_entry: '', e_zone_code: '', e_base_address: '', e_detail_address: '', e_photo: '',
            e_salary_account_bank: '', e_salary_account_num: '', e_salary_account_owner: '',
            e_note: '', d_code: ''
          });
          setPhotoPreview(null);
          setActiveTab('1');
          fetch(`${fetchURL.protocol}${fetchURL.url}/hrCard/hrCardList`)
            .then(res => res.json())
            .then(data => setItems(data));
        }
      });
  };

  const columns = [
    { label: '사번', dataKey: 'e_id', width: 190 },
    { label: '이름', dataKey: 'e_name', width: 235 },
    { label: '이메일', dataKey: 'e_email', width: 355 },
    { label: '부서', dataKey: 'd_name', width: 235 },
    { label: '직위', dataKey: 'e_position', width: 225 },
    { label: '재직 상태', dataKey: 'e_status', width: 225 },
    { label: '등록일', dataKey: 'e_reg_date', width: 255 },
  ];

  return (
    <div>
      <MessageBox text="인사카드 관리" />
      <Tabs activeKey={activeTab} onSelect={setActiveTab}>
        <Tabs.Tab eventKey="1" title="인사카드 목록">
          <div style={{ minHeight: 400, position: 'relative' }}>
            {loading ? (
              <>
                <Placeholder.Paragraph rows={14} />
                <Loader center content="불러오는 중..." />
              </>
            ) : (
              <HrTable
                columns={columns}
                items={items}
                renderActionButtons={(rowData) => (
                  <Link to={`/main/hr_emp_card_detail/${rowData.e_id}`}>
                    <Button appearance='ghost' size='xs' color='green'>
                      조회
                    </Button>
                  </Link>
                )}
              />
            )}
          </div>  
        </Tabs.Tab>

        <Tabs.Tab eventKey="2" title="인사카드 등록">
          <FlexboxGrid style={{ marginTop: 30, marginLeft: 10, marginBottom: 50 }}>
            <FlexboxGrid.Item colspan={20} style={{ maxWidth: 800 }}>
              <Panel header={<h4>📁 사원 정보 입력</h4>} bordered>
                <Form fluid>
                  <Grid fluid>
                    <Row gutter={16}>
                      <Col xs={12}>
                        <Form.Group>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                          <Uploader
                            key={uploaderKey}
                            action={`${hrURL}/hrCardPhoto`}   // 백엔드 파일 업로드 URL
                            name="file"                                         // form-data에서 사용할 키 이름
                            fileListVisible={false}
                            autoUpload={true}
                            listType="picture"
                            onChange={(fileList) => {
                              const file = fileList[0]?.blobFile;
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPhotoPreview(reader.result);               // 브라우저 즉시 미리보기
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            onSuccess={(res) => {
                              setUploading(false);
                              setForm((prev) => ({ ...prev, e_photo: res }));   // 서버 저장용 e_photo 업데이트
                            }}
                            onError={() => {
                              setUploading(false);
                              alert("1MB 이하의 사진만 등록할 수 있습니다");
                            }}
                          >
                            <div style={{ width: 120, height: 160, border: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {uploading ? (
                                <Loader />
                              ) : photoPreview ? (
                                <img
                                  src={photoPreview}
                                  alt="미리보기"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                '사진 업로드'
                              )}
                            </div>
                          </Uploader>

                          {/* 사진 삭제 버튼 */}
                          {photoPreview && (
                            <Button
                              appearance="ghost"
                              size="xs"
                              onClick={() => {
                                setPhotoPreview(null);                           // 미리보기 지우기
                                setForm((prev) => ({ ...prev, e_photo: '' }));   // 서버 저장용 e_photo 초기화
                                setUploaderKey(prev => prev + 1);                // Uploader 자체의 파일 리스트가 초기화 되지 않아 다른 사진 등록 불가능한 경우, Uploader 자체 리렌더링, 삭제 버튼 누를 때 uploaderKey를 +1 올린다 > 리액트가 key가 바뀌면 Uploader를 통째로 새로 만든다
                              }}
                            >
                              삭제
                            </Button>
                          )}
                        </div>
                        </Form.Group>
                        <Form.Group><Form.ControlLabel>사원 이름 *</Form.ControlLabel><Form.Control value={form.e_name} onChange={val => setForm({ ...form, e_name: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>전화번호 *</Form.ControlLabel><Form.Control value={form.e_tel} onChange={val => setForm({ ...form, e_tel: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>생년월일 *</Form.ControlLabel><Form.Control type="date" value={form.e_birth} onChange={val => setForm({ ...form, e_birth: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>이메일 *</Form.ControlLabel><Form.Control value={form.e_email} onChange={val => setForm({ ...form, e_email: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>직위 *</Form.ControlLabel>
                          <HrDropdown title={form.e_position || '선택'} items={['사원', '대리', '과장', '차장', '부장', '이사', '상무', '전무']} onSelect={val => setForm({ ...form, e_position: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>부서 *</Form.ControlLabel>
                          <HrDropdown title={deptList.find(d => d.value === form.d_code)?.label || '선택'} items={deptList} onSelect={val => setForm({ ...form, d_code: val })} /></Form.Group>
                          
                      </Col>
                      <Col xs={12}>
                        <Form.Group><Form.ControlLabel>입사 구분</Form.ControlLabel><HrRadio value={form.e_entry} onChange={(val) => setForm({ ...form, e_entry: val })} options={['신입', '경력']} /></Form.Group>
                        <Form.Group><Form.ControlLabel>재직 상태 *</Form.ControlLabel><Form.Control placeholder="ex) 재직, 휴직, 퇴직 등" value={form.e_status} onChange={val => setForm({ ...form, e_status: val })} /></Form.Group>
                        <Form.Group>
                          <Form.ControlLabel>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>주소</span>
                              <Button size="xs" appearance="ghost" onClick={handleAddress}>
                                우편번호 검색
                              </Button>
                            </div>
                          </Form.ControlLabel>

                          {/* 우편번호 */}
                          <Form.Control
                            name="e_zone_code"
                            value={form.e_zone_code}
                            onChange={val => setForm({ ...form, e_zone_code: val })}
                            style={{ marginBottom: 8 }}
                          />

                          {/* 기본주소 */}
                          <Form.Control
                            name="e_base_address"
                            value={form.e_base_address}
                            onChange={val => setForm({ ...form, e_base_address: val })}
                            style={{ marginBottom: 8 }}
                          />

                          {/* 상세주소 */}
                          <Form.Control
                            name="e_detail_address"
                            value={form.e_detail_address}
                            onChange={val => setForm({ ...form, e_detail_address: val })}
                          />
                        </Form.Group>
                        <Form.Group><Form.ControlLabel>급여통장 - 은행 *</Form.ControlLabel><Form.Control value={form.e_salary_account_bank} onChange={val => setForm({ ...form, e_salary_account_bank: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>급여통장 - 계좌번호 *</Form.ControlLabel><Form.Control value={form.e_salary_account_num} onChange={val => setForm({ ...form, e_salary_account_num: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>급여통장 - 예금주 *</Form.ControlLabel><Form.Control value={form.e_salary_account_owner} onChange={val => setForm({ ...form, e_salary_account_owner: val })} /></Form.Group>
                        <Form.Group><Form.ControlLabel>비고</Form.ControlLabel><Input as="textarea" rows={3} value={form.e_note} onChange={val => setForm({ ...form, e_note: val })} /></Form.Group>
                      </Col>
                    </Row>
                  </Grid>
                  <Divider />
                  <Row>
                    <Col xs={24} style={{ textAlign: 'center' }}>
                      <ButtonToolbar>
                        <Button appearance="ghost" onClick={handleRegister}>등록</Button>
                      </ButtonToolbar>
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default HrEmpCardPage;
