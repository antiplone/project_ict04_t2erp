import React, { useState } from "react";
import { Button, Container, Form, Message } from "rsuite";
import { useNavigate } from "react-router-dom";
import Appconfig from "#config/AppConfig.json";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import "#components/common/css/common.css";
import "#components/common/css/warehouseform.css";
import { useToast } from '#components/common/ToastProvider';

const WarehousSave = () => {
	const fetchURL = Appconfig.fetch['mytest']
	const navigate = useNavigate();
	const { showToast } = useToast();
	
	const [storage, setStorage] = useState({
      storage_name: "",
      storage_zone_code: "",
      storage_base_address: "",
      storage_detail_address: ""
	});

	const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
	
	const handleAddress = () => {
		open({
			onComplete: (data) => {
				let baseAddress = data.address;
				let extra = data.bname || '';
				if (data.buildingName) extra += `, ${data.buildingName}`;
				if (extra) baseAddress += ` (${extra})`;
				setStorage(prev => ({
					...prev,
					storage_zone_code: data.zonecode,
					storage_base_address: baseAddress,
					storage_detail_address: ""
				}));
			}
		});
	};

	const changeValue = (value, event) => {
      setStorage((prev) => ({
         ...prev,
         [event.target.name]: value,
      }));
	};

	const submitStorage = async () => {
      // 입력값 검증: 하나라도 비어 있으면 알람 띄우기
		if (Object.values(storage).some(value => !value.trim())) {
			console.log("storage : ", storage)
			showToast("모든 필드를 입력해주세요.");
			return;
		}

      try {
         const response = await fetch(`${fetchURL.protocol}${fetchURL.url}/warehouse/warehouseInsert`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(storage),
         });

         if (response.status === 201) {
			showToast("창고 등록에 성공했습니다.");
            navigate("/main/logis-warehouse");
         } else {
            showToast("창고 등록에 실패했습니다.");
         }
      } catch (error) {
         console.error("등록 실패:", error);
      }
   };

   return (
      <div>
		   <Message type="error" className="main_title">
			   창고 등록
		   </Message>
			<Container style={{margin: '0 auto', maxWidth : '800px', alignItems : 'center'}}>
			   <Form
				   fluid
				   onChange={setStorage}
				   formValue={storage}
				   className="storage-form"
			   >
				   <Form.Group controlId="storage_code" className="form-row" width={600}>
					   <div className="form-label">창고코드</div>
					   <div className="form-value">창고코드는 자동 생성됩니다.</div>
				   </Form.Group>

				   <Form.Group controlId="storage_name" className="form-row">
					   <Form.ControlLabel className="form-label">창고명</Form.ControlLabel>
					   <Form.Control
						   name="storage_name"
						   placeholder="창고명을 입력하세요"
						   onChange={changeValue}
						   className="form-input"
					   />
				   </Form.Group>
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
                            name="storage_zone_code"
                            onChange={val => setStorage({ ...prev, storage_zone_code: val })}
                            style={{ marginBottom: 8 }}
                            placeholder="우편번호를 입력하세요"
                          />

                          {/* 기본주소 */}
                          <Form.Control
                            name="storage_base_address"
                            onChange={val => setStorage({ ...prev, storage_base_address: val })}
                            style={{ marginBottom: 8 }}
                            placeholder="주소를 입력하세요"
                          />

                          {/* 상세주소 */}
                          <Form.Control
                            name="storage_detail_address"
                            onChange={val => setStorage({ ...prev, storage_detail_address: val })}
                            placeholder="상세주소를 입력하세요"
                          />
                        </Form.Group>
			   </Form>

				<div>
				   <Button
					   appearance="primary"
					   onClick={submitStorage}
					   className="text_center margin_0_auto display_block"
					   style={{ display: 'block' }}
				   >
					   창고 등록
				   </Button>
			   </div>
         </Container>
      </div>
   );
};

export default WarehousSave;
