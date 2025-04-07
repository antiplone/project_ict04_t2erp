import React, { useState, useEffect } from "react";
import { Message, Form, Input, ButtonToolbar, Button, Tabs } from 'rsuite';
import "../components/common/Sell_maintitle.css";
import { useNavigate, useParams } from "react-router-dom";

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);


const SellRequestUpdateClient = (props) => {

    const navigate = useNavigate();
    const propsparam = useParams();
    const sc_no = propsparam.sc_no;
        

    const [clientAdd, setClientAdd] = useState({
        sc_client_name: '',
        sc_ceo: '',
        sc_biz_num: '',
        sc_email: '',
        sc_tel: '',
        sc_address: '',
        sc_type: '',
        sc_industry: '',
        sc_status: '',
        sc_note: ''
    });

    // 1건 조회
    useEffect(() => {
    
            fetch("http://localhost:8081/reqCli/reqClientDetail/" + sc_no)
                .then((res) => res.json())
                .then((res) => {
                    setClientAdd(res); // res는 계속 새로 만들어져서 set을 하므로 스프레드 연산자를 붙이지 않는다. 상세정보를 setBoard에 전달해서 화면에 뿌린다.
                });
        }, []);


    const changeValue = (value, name) => {

        setClientAdd({
            ...clientAdd,
            [name] : value
        })
    }

    const submitclientAdd = (e) => {
        //e.preventDefault();
        console.log("폼 제출됨! 데이터:", clientAdd);

        fetch("http://localhost:8081/reqCli/reqClientUpdate/" + sc_no, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json;charset=utf-8"
            },
            body: JSON.stringify(clientAdd)
        })
        // 결과를 돌려받는 곳
        .then((res) => {
            console.log(1, res);
            if(res.status === 200) return res.json();   // // 수정 정상이면(200이면) ture 리턴
            else return null;
        })
        .then((res) => {
            console.log('정상', res);

            // 수정 성공 시 페이지 새로고침
            if(res != null) { 
                //window.location.reload();
                alert("수정 성공!");
                navigate('/main/sell_request_client')
            }
            else alert("수정 실패");
        })
        // 예외처리
        .catch(error => {
            console.log('실패', error);
        })
    }

    const [activeKey, setActiveKey] = useState("1"); // Tabs의 활성화된 탭을 관리하는 상태

    return (
        <div>
            <div>
            <Message type="info" bordered showIcon className="main_title">
            거래처 관리_등록 요청서 수정
    		</Message>
            </div>

            <Tabs
                activeKey={activeKey}
                onSelect={(key) => setActiveKey(key)} // 탭을 클릭할 때 활성화된 탭을 변경
                className="all_title"
            >

			<Tabs.Tab eventKey="1" title="등록 요청 수정">
                <Form layout="horizontal" style={{ width: '50%' }}>

                    <Form.Group controlId="name-1">
                    <Form.ControlLabel>요청 부서</Form.ControlLabel>
                    <Form.Control name="sc_req_d_name" 
                        onChange={(value) => changeValue(value, 'sc_req_d_name')} 
                        value={clientAdd.sc_client_name} />
                    <Form.HelpText>Required</Form.HelpText>
                    </Form.Group>

                    <Form.Group controlId="name-1">
                    <Form.ControlLabel>거래처명</Form.ControlLabel>
                    <Form.Control name="sc_client_name" 
                        onChange={(value) => changeValue(value, 'sc_client_name')} 
                        value={clientAdd.sc_client_name} />
                    <Form.HelpText>Required</Form.HelpText>
                    </Form.Group>
                    
                    <Form.Group controlId="name-2">
                    <Form.ControlLabel>대표자명</Form.ControlLabel>
                    <Form.Control name="sc_ceo" 
                        onChange={(value) => changeValue(value, 'sc_ceo')} 
                        value={clientAdd.sc_ceo} />
                    <Form.HelpText>Required</Form.HelpText>
                    </Form.Group>
                

                    <Form.Group controlId="name-3">
                    <Form.ControlLabel>사업자등록번호</Form.ControlLabel>
                    <Form.Control name="sc_biz_num" 
                        onChange={(value) => changeValue(value, 'sc_biz_num')} 
                        value={clientAdd.sc_biz_num} />
                    <Form.HelpText>Required</Form.HelpText>
                    </Form.Group>

                    <Form.Group controlId="email-1">
                    <Form.ControlLabel>이메일</Form.ControlLabel>
                    <Form.Control name="sc_email" type="email" 
                        onChange={(value) => changeValue(value, 'sc_email')} 
                        value={clientAdd.sc_email} />
                    <Form.HelpText tooltip>Required</Form.HelpText>
                    </Form.Group>

                    <Form.Group controlId="tel">
                    <Form.ControlLabel>연락처</Form.ControlLabel>
                    <Form.Control name="sc_tel" 
                        onChange={(value) => changeValue(value, 'sc_tel')} 
                        value={clientAdd.sc_tel} />
                    </Form.Group>

                    <Form.Group controlId="address">
                    <Form.ControlLabel>거래처 주소</Form.ControlLabel>
                    <Form.Control name="sc_address" 
                        onChange={(value) => changeValue(value, 'sc_address')} 
                        value={clientAdd.sc_address} />
                    </Form.Group>

                    <Form.Group controlId="name-4">
                    <Form.ControlLabel>업태</Form.ControlLabel>
                    <Form.Control name="sc_type" 
                        onChange={(value) => changeValue(value, 'sc_type')} 
                        value={clientAdd.sc_type} />
                    </Form.Group>

                    <Form.Group controlId="name-5">
                    <Form.ControlLabel>업종</Form.ControlLabel>
                    <Form.Control name="sc_industry" 
                        onChange={(value) => changeValue(value, 'sc_industry')} 
                        value={clientAdd.sc_industry} />
                    </Form.Group>

                    <Form.Group controlId="textarea-6">
                    <Form.ControlLabel>비고</Form.ControlLabel>
                    <Form.Control name="sc_note" rows={5} accepter={Textarea} 
                        onChange={(value) => changeValue(value, 'sc_note')} 
                        value={clientAdd.sc_note} />
                    </Form.Group>

                    <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={submitclientAdd}>Submit</Button>
                        <Button appearance="default">Cancel</Button>
                    </ButtonToolbar>
                    </Form.Group>
                </Form>
            </Tabs.Tab>
			
			</Tabs>
        </div>
    );
};

export default SellRequestUpdateClient;