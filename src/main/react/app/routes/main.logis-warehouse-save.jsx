import React, { useState } from "react";
import { Button, Form, Message } from "rsuite";
import { useNavigate } from "react-router-dom";
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";

const WarehousSave = () => {
	const fetchURL = Appconfig.fetch['mytest']
	const navigate = useNavigate();
	const [storage, setStorage] = useState({
      storage_name: "",
      storage_location: ""
	});

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
			alert("모든 필드를 입력해주세요.");
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
			alert("창고 등록에 설공했습니다.");
            navigate("/main/logis-warehouse");
         } else {
            alert("창고 등록에 실패했습니다.");
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
         <Form
            fluid
            onChange={setStorage}
            formValue={storage}
            className="text_center"
         >
            <Form.Group controlId="storage_code" className="display_flex">
               <div className="div_left">
      				창고코드
			   </div>
               <div className="div_input_save text_left">
      				창고코드는 자동 생성됩니다.
			   </div>
            </Form.Group>

            <Form.Group controlId="storage_name" className="display_flex">
               <Form.ControlLabel>창고명</Form.ControlLabel>
               <Form.Control
                  name="storage_name"
                  placeholder="창고명을 입력하세요"
                  onChange={changeValue}
               />
            </Form.Group>

            <Form.Group controlId="storage_location" className="display_flex">
               <Form.ControlLabel>창고 주소</Form.ControlLabel>
               <Form.Control
                  name="storage_location"
                  placeholder="창고 주소를 입력하세요"
                  onChange={changeValue}
               />
            </Form.Group>
         </Form>
         
         <Button 
            appearance="primary" 
            onClick={submitStorage}  
            className="text_center margin_0_auto display_block" 
            style={{ display: 'block' }}
         >
            창고 등록
         </Button>
      </div>
   );
};

export default WarehousSave;
