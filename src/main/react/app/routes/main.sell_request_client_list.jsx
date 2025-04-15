import React, { useState, useEffect } from "react";
import { Table, Button } from 'rsuite';
import { useNavigate, useParams } from "react-router-dom";

import "../components/common/Sell_maintitle.css";

const { Column, HeaderCell, Cell } = Table;

const SellRequestClientList = () => {

	const navigate = useNavigate();

	// 전체 리스트
    const [reqClient, setReqClient] = useState([]);
    
        useEffect(()=> {
            fetch("http://localhost:8081/sell/reqClientList", {
                method: "GET"
            })
            .then(res => res.json())
            .then(res => {
                console.log(1, res);
                setReqClient(res);
            });
        }, []);
	
	// 수정
	const updateReqClient = (sc_no) => {
		navigate('/main/sell_request_update_client/' + sc_no);  // App.js의 Route에서 UpdateForm(수정페이지) 호출
    }

	// 삭제
	const deleteReqClient = (sc_no) => {
		fetch("http://localhost:8081/sell/reqClientDel/" + sc_no, {
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

    return (
        <div>
            {/* 요청 리스트 */}
            <Table
			height={400}
			width={1300}
			margin='0 auto'
			data={reqClient}
			>

			<Column width={50} className="r_title">
				<HeaderCell>순번</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_no}
				</Cell>
			</Column>
            
            <Column width={70} className="r_title">
				<HeaderCell>승인상태</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_status}
				</Cell>
			</Column>


			<Column width={100} className="r_title">
				<HeaderCell>거래처명</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_client_name}
				</Cell>
			</Column>

			<Column width={100} className="r_title">
				<HeaderCell>대표자명</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_ceo}
				</Cell>
			</Column>

			<Column width={150} className="r_title">
				<HeaderCell>사업자등록번호</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_biz_num}
				</Cell>
			</Column>

			<Column width={150} className="r_title">
				<HeaderCell>이메일</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_email}
				</Cell>
			</Column>

			<Column width={100} className="r_title">
				<HeaderCell>연락처</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_tel}
				</Cell>
			</Column>

            <Column width={150} className="r_title">
				<HeaderCell>등록일</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_date}
				</Cell>
			</Column>

			<Column width={70} className="r_title">
				<HeaderCell>상세보기</HeaderCell>
				<Cell>
				<Button appearance="link">
					상세
				</Button>
				</Cell>
			</Column>

			<Column width={140} className="r_title">
				<HeaderCell>관리</HeaderCell>
				<Cell>
				{(rowData) => (
            <>
                <Button onClick={() => updateReqClient(rowData.sc_no)} appearance="link">수정</Button>
                <Button onClick={() => deleteReqClient(rowData.sc_no)} appearance="link">삭제</Button>
            </>
        )}
				</Cell>
			</Column>
			
			</Table>
            
            
        </div>
    );
};

export default SellRequestClientList;



			{/* <Column width={200} className="reqC_Action_text">
				<HeaderCell>주소</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_address}
				</Cell>
			</Column> */}

			{/* <Column width={150} className="reqC_Action_text">
				<HeaderCell>업태</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_type}
				</Cell>
			</Column>

            <Column width={150} className="reqC_Action_text">
				<HeaderCell>업종</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_industry}
				</Cell>
			</Column> */}

            {/* <Column width={200} className="reqC_Action_text">
				<HeaderCell>비고</HeaderCell>
				<Cell>
					{(rowData) => rowData.sc_note}
				</Cell>
			</Column> */}
