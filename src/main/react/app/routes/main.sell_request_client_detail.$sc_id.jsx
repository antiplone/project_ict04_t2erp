import React, { useState, useEffect } from "react";
import { Message, Card, List, ButtonToolbar, Button } from 'rsuite';
import { useParams, useNavigate } from "react-router-dom";
import "#styles/sell.css";
import AppConfig from "#config/AppConfig.json";

// sell_request_client_detail => 거래처 등록 요청 상세 페이지

const sell_request_client_detail = () => {
    const navigate = useNavigate();

    const { sc_id } = useParams();  // URL에서 /sell/reqClientDetail/:sc_id 가져오기

    const [reqClientList, setReqClientList] = useState([]);

    const fetchURL = AppConfig.fetch['mytest'];
    const rowData = reqClientList[0] || {}; // 값이 없을 때를 대비해 빈 객체 처리
      
   // fetch()를 통해 톰캣서버에게 데이터를 요청
    useEffect(() => {
        if (!sc_id) return; // undefined 방지

        fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientDetail/` + sc_id, {
            method: "GET"
        })
        .then(res => res.json())
        .then(res => {
            setReqClientList([res]);    // 배열로 감싸서 Table에 맞게 넣음
            console.log(setReqClientList);
        });
    }, [sc_id]);    // sc_id 바뀌면 다시 fetch

    // 수정
	const updateReqClient = (sc_id) => {
		navigate('/main/sell_request_update_client/' + sc_id);  // App.js의 Route에서 UpdateForm(수정페이지) 호출
    }

	// 삭제
	const deleteReqClient = (sc_id) => {
		fetch("http://localhost:8081/sell/reqClientDel/" + sc_id, {
			method: 'DELETE',
		})
		.then((res) => res.text())
		.then((res) => {
			if (res != null) {	// 대소문자 주의
				alert('삭제 성공!');
				setReqClient(reqClient.filter(item => item.sc_no !== sc_no)); // 삭제된 항목 제거
			} else {
				alert('삭제 실패');
			}
		});
	}

    // 리스트로 이동
    const listReqClient = () =>  {
        navigate('/main/sell_request_client/');
    }

    return (
        <div>
            <div>
                <Message type="info" className="main_title">
                거래처 관리_상세 정보
                </Message>
            </div>

            <Card className="detail" shaded>
                <Card.Header as="h5">[ 요청 내역 ] </Card.Header>
                <Card.Body>
                    
                    <List>
                    {reqClientList.map((rowData, idx) => (
                    <List.Item key={idx}>
                        <strong>순번</strong>: {rowData.sc_id} <br />
                        <strong>거래처명</strong>: {rowData.sc_client_name} <br />
                        <strong>사업자등록번호</strong>: {rowData.sc_biz_num} <br />
                        <strong>대표자명</strong>: {rowData.sc_ceo} <br />
                        <strong>이메일</strong>: {rowData.sc_email} <br />
                        <strong>연락처</strong>: {rowData.sc_tel} <br /> <br />
                        <strong>요청부서</strong>: {rowData.sc_req_d_name} <br />
                        <strong>등록일</strong>: {rowData.sc_date} <br /> <br />
                        <strong>승인상태</strong>: {rowData.sc_status} <br />
                    </List.Item>
                    ))}
                    </List>

                </Card.Body>
                <div className="reqDetailBtn">
                    <Card.Footer>
                        {/* <Text muted><strong>승인상태</strong>: {rowData.sc_status}</Text> */}
                        <ButtonToolbar >
                            <Button onClick={() => listReqClient()} appearance="primary" >목록</Button>
                            <Button onClick={() => updateReqClient(rowData.sc_id)} appearance="primary">수정</Button>
                            <Button onClick={() => deleteReqClient(rowData.sc_id)} appearance="primary">삭제</Button>
                        </ButtonToolbar>
                    </Card.Footer>
                </div>
            </Card>
            
        </div>
    );
};

export default sell_request_client_detail;