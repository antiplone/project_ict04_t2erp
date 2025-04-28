import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@remix-run/react';
import {
  Message, Form, Divider, ButtonToolbar, Button, FlexboxGrid,
  Panel, Grid, Row, Col, Input, Uploader, Loader, useToaster
} from 'rsuite';
import HrDropdown from '#components/hr/HrDropdown';
import HrRadio from '#components/hr/HrRadio';
import { useDaumPostcodePopup } from 'react-daum-postcode';

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
Textarea.displayName = "Textarea";

// 이미지 미리보기 처리 함수
const handleImagePreview = (file, setEmp) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    setEmp(prev => ({ ...prev, e_photo: reader.result }));
  };
  reader.readAsDataURL(file);
};

const HrEmpCardDetail = () => {
  const { e_id } = useParams();
  const navigate = useNavigate();
  const toaster = useToaster();
  const [emp, setEmp] = useState({});
  const [deptList, setDeptList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");  // ⭐ 추가

  const handleAddress = () => {
    open({
      onComplete: (data) => {
        let baseAddress = data.address;
        let extra = data.bname || '';
        if (data.buildingName) extra += `, ${data.buildingName}`;
        if (extra) baseAddress += ` (${extra})`;
        setEmp(prev => ({
          ...prev,
          e_zone_code: data.zonecode,
          e_base_address: baseAddress,
          e_detail_address: ''
        }));
      }
    });
  };

  // 상세 보기
  useEffect(() => {
    fetch(`http://localhost:8081/hrCard/hrCardDetail/${e_id}`)
      .then(res => res.json())
      .then(data => {
        setEmp(data);
      })
      .catch(err => console.error("사원 조회 실패:", err));
  }, [e_id]);

  // 부서 목록 불러오기
  useEffect(() => {
    fetch('http://localhost:8081/hrDept/hrDeptList')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(dept => ({
          label: dept.d_name,
          value: dept.d_code
        }));
        setDeptList(mapped);
      })
      .catch(err => console.error("부서 조회 실패:", err));
  }, []);

  const handleChange = (key, val) => {
    setEmp(prev => ({ ...prev, [key]: val }));
  };

  // 수정
  const handleUpdate = () => {
    fetch(`http://localhost:8081/hrCard/hrCardUpdate/${e_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp)
    })
      .then(res => res.json())
      .then(() => {
        alert('수정 완료되었습니다.');
        navigate('/main/hr_emp_card');
      })
      .catch(err => {
        alert('수정 실패');
        console.error(err);
      });
  };

  // 삭제
  const handleDelete = () => {
    fetch(`http://localhost:8081/hrCard/hrCardDelete/${e_id}`, {
      method: 'DELETE'
    })
      .then(res => res.text())
      .then(result => {
        if (result) {
          alert('삭제 완료되었습니다.');
          navigate('/main/hr_emp_card');
        } else {
          alert('삭제 실패');
        }
      });
  };

  return (
    <div>
      <Message type="info" className="main_title">사원 상세정보</Message>

      <FlexboxGrid style={{ marginTop: 30, marginLeft: 10, marginBottom: 50 }}>
        <FlexboxGrid.Item colspan={20} style={{ maxWidth: 800, width: '100%' }}>
          <Panel header={<h4>👤 사원 상세 조회</h4>} bordered style={{ background: '#fff' }}>
            <Form fluid>
              <Grid fluid>
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.ControlLabel>사진</Form.ControlLabel>
                      <Uploader
                        fileListVisible={false}
                        listType="picture"
                        action="http://localhost:8081/hrCard/hrCardPhoto"   // 다시 올릴 서버 주소
                        name="file"
                        autoUpload={true}       // 파일 선택하면 바로 서버 전송
                        onUpload={(file) => {
                          // 로컬 미리보기
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEmp(prev => ({ ...prev, e_photo: reader.result })); 
                          };
                          reader.readAsDataURL(file.blobFile);
                        }}
                        onSuccess={(response) => {
                          // 서버가 파일 URL을 응답해주면 그걸 emp.e_photo에 저장
                          setEmp(prev => ({ ...prev, e_photo: response }));
                          setUploading(false);
                        }}
                        onError={() => {
                          alert('사진 업로드 실패!');
                          setUploading(false);
                        }}
                      >
                        <div style={{
                          width: 130,
                          height: 150,
                          border: '1px dashed #ccc',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}>
                          {emp.e_photo ? (
                          <img
                            // emp.e_photo가 절대 URL이면 그대로, 아니면 백엔드 주소 붙여주기
                            src={
                              emp.e_photo.startsWith('http')
                                ? emp.e_photo
                                : `http://localhost:8081${emp.e_photo}`
                            }
                            alt="사진 미리보기"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ color: '#999' }}>사진 업로드</span>
                        )}
                        </div>
                      </Uploader>
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>사원 이름</Form.ControlLabel>
                      <Form.Control name="e_name" value={emp.e_name || ''} onChange={(val) => handleChange('e_name', val)} />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>전화번호</Form.ControlLabel>
                      <Form.Control name="e_tel" value={emp.e_tel || ''} onChange={(val) => handleChange('e_tel', val)} />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>생년월일</Form.ControlLabel>
                      <Form.Control name="e_birth" type="date" value={emp.e_birth || ''} onChange={(val) => handleChange('e_birth', val)} />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>이메일</Form.ControlLabel>
                      <Form.Control name="e_email" value={emp.e_email || ''} onChange={(val) => handleChange('e_email', val)} />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>직위</Form.ControlLabel>
                      <HrDropdown
                        title={emp.e_position || '직위 선택'}
                        items={['사원', '대리', '과장', '차장', '부장', '이사', '상무', '전무']}
                        onSelect={(val) => handleChange('e_position', val)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>부서</Form.ControlLabel>
                      <HrDropdown
                        title={deptList.find(d => d.value === emp.d_code)?.label || '부서 선택'}
                        items={deptList}
                        onSelect={(val) => handleChange('d_code', val)}
                      />
                    </Form.Group>
                    
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.ControlLabel>재직 상태</Form.ControlLabel>
                      <Form.Control name="e_status" value={emp.e_status || ''} onChange={(val) => handleChange('e_status', val)} />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>입사 구분</Form.ControlLabel>
                      <HrRadio value={emp.e_entry} onChange={(val) => handleChange('e_entry', val)} options={['신입', '경력']} />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>급여통장 - 은행</Form.ControlLabel>
                      <Form.Control
                        name="e_salary_account_bank"
                        value={emp.e_salary_account_bank || ''}
                        onChange={(val) => handleChange('e_salary_account_bank', val)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>급여통장 - 계좌번호</Form.ControlLabel>
                      <Form.Control
                        name="e_salary_account_num"
                        value={emp.e_salary_account_num || ''}
                        onChange={(val) => handleChange('e_salary_account_num', val)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>급여통장 - 예금주</Form.ControlLabel>
                      <Form.Control
                        name="e_salary_account_owner"
                        value={emp.e_salary_account_owner || ''}
                        onChange={(val) => handleChange('e_salary_account_owner', val)}
                      />
                    </Form.Group>
                    <Form.Group>
                    <Form.ControlLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>주소 *</span>
                        <Button size="xs" appearance="ghost" onClick={handleAddress}>
                          우편번호 검색
                        </Button>
                      </div>
                    </Form.ControlLabel>

                    {/* 우편번호 */}
                    <Form.Control
                      name="e_zone_code"
                      value={emp.e_zone_code || ''}
                      onChange={(val) => handleChange('e_zone_code', val)}
                      style={{ marginBottom: 8 }}
                    />

                    {/* 기본주소 */}
                    <Form.Control
                      name="e_base_address"
                      value={emp.e_base_address || ''}
                      onChange={(val) => handleChange('e_base_address', val)}
                      style={{ marginBottom: 8 }}
                    />

                    {/* 상세주소 */}
                    <Form.Control
                      name="e_detail_address"
                      value={emp.e_detail_address || ''}
                      onChange={(val) => handleChange('e_detail_address', val)}
                    />
                  </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>비고</Form.ControlLabel>
                      <Form.Control name="e_note" accepter={Textarea} value={emp.e_note || ''} onChange={(val) => handleChange('e_note', val)} rows={3} />
                    </Form.Group>
                  </Col>
                </Row>

                <Divider />

                <Row>
                  <Col xs={24} style={{ textAlign: 'center' }}>
                    <ButtonToolbar>
                      <Button appearance="ghost" color="green" onClick={() => navigate('/main/hr_emp_card')}>목록</Button>
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

export default HrEmpCardDetail;