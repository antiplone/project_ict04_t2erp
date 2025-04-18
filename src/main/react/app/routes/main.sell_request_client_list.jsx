import React, { useState, useEffect } from "react";
import { Table, Button } from 'rsuite';
import { useNavigate, useParams } from "react-router-dom";
import AppConfig from "#config/AppConfig.json";
import "#styles/sell.css";

// sell_request_client_list => 거래처 등록 요청한 전체 리스트

const { Column, HeaderCell, Cell } = Table;

const SellRequestClientList = () => {

	const navigate = useNavigate();
	const fetchURL = AppConfig.fetch['mytest'];

	// 전체 리스트
    const [reqClient, setReqClient] = useState([]);
    
        useEffect(()=> {
            fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientList`, {
                method: "GET"
            })
            .then(res => res.json())
            .then(res => {
                console.log(1, res);
                setReqClient(res);
            });
        }, []);
	
	// 상세 조회
	const detailReqClient = (sc_id) => {
		navigate('/main/sell_request_client_detail/' + sc_id);
	}

    return (
        <div>
            {/* 요청 리스트 */}
            <Table
				height={400}
				width={1200}
				margin='0 auto'
				data={reqClient}
			>

				<Column width={50} className="r_title">
					<HeaderCell>순번</HeaderCell>
					<Cell>{(rowData) => rowData.sc_id}</Cell>
				</Column>
				
				<Column width={70} className="r_title">
					<HeaderCell>승인상태</HeaderCell>
					<Cell>{(rowData) => rowData.sc_status}</Cell>
				</Column>


				<Column width={100} className="r_title">
					<HeaderCell>거래처명</HeaderCell>
					<Cell>{(rowData) => rowData.sc_client_name}</Cell>
				</Column>

				<Column width={100} className="r_title">
					<HeaderCell>대표자명</HeaderCell>
					<Cell>{(rowData) => rowData.sc_ceo}</Cell>
				</Column>

				<Column width={150} className="r_title">
					<HeaderCell>사업자등록번호</HeaderCell>
					<Cell>{(rowData) => rowData.sc_biz_num}</Cell>
				</Column>

				<Column width={150} className="r_title">
					<HeaderCell>이메일</HeaderCell>
					<Cell>{(rowData) => rowData.sc_email}</Cell>
				</Column>

				<Column width={150} className="r_title">
					<HeaderCell>연락처</HeaderCell>
					<Cell>{(rowData) => rowData.sc_tel}</Cell>
				</Column>

				<Column width={150} className="r_title">
					<HeaderCell>등록일</HeaderCell>
					<Cell>{(rowData) => rowData.sc_date}</Cell>
				</Column>

				<Column width={70} className="r_title">
					<HeaderCell>상세보기</HeaderCell>
					<Cell>
					{(rowData) => (
					<Button appearance="link" onClick={() => detailReqClient(rowData.sc_id)} style={{ marginTop: -7 }}>
						조회
					</Button>
					)}
					</Cell>
				</Column>
			</Table>
        </div>
    );
};

export default SellRequestClientList;