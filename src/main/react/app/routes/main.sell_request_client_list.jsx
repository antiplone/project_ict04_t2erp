import React, { useState, useEffect } from "react";
import { Table, Button, Tabs, Message, Container, Placeholder, Loader } from 'rsuite';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';	
import AppConfig from "#config/AppConfig.json";
import "#styles/sell.css";
import SellRequestClient from "./main.sell_request_client_insert";

// sell_request_client_list => 거래처 등록 요청한 전체 리스트

const { Column, HeaderCell, Cell } = Table;

const SellRequestClientList = () => {

	const navigate = useNavigate();
	const fetchURL = AppConfig.fetch['mytest'];
	const [isLoading, setIsLoading] = useState(true);	// 로딩중일때

	// 전체 리스트
    const [reqClient, setReqClient] = useState([]);

	// 현재 페이지의 URL 경로, 쿼리, 상태(state) 같은 위치 정보를 가져오는 함수
    const location = useLocation();

	// 탭 상태(기본값 1 : 전체리스트)
	const [activeTab, setActiveTab] = useState("1"); // Tabs의 활성화된 탭을 관리하는 상태
	
	// location.state가 변경, location.state.resetTab이 있다면 setActiveTab()으로 탭 상태로
	useEffect(() => {
		if (location.state && location.state.resetTab) {
			setActiveTab(location.state.resetTab);
		}
	}, [location.state]);

	useEffect(()=> {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/reqClientList`, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			// console.log(1, res);
			setReqClient(res);
			setIsLoading(false);
		});
	}, []);
	
	// 상세 조회
	const detailReqClient = (sc_id) => {
		navigate('/main/sell_request_client_detail/' + sc_id);
	}

	// 결재 상태에 따라 필터링 만들기
	const filteredList = reqClient.filter(row => {
		if (activeTab === "1") return true; // 전체
		if (activeTab === "2")  {
			return row.sa_approval_status && row.sa_approval_status.trim() === "진행중";}
		if (activeTab === "3") return row.sa_approval_status && row.sa_approval_status.trim() === "승인";
		return false;
	});

	const styles = {
        backgroundColor: '#f8f9fa',
    };

    return (
        <div>
			<div>
				<Message type="info" className="main_title">
					거래처 관리_등록 요청 및 조회
				</Message>
            </div>

			<Tabs 
				activeKey={activeTab}
				onSelect={(key) => setActiveTab(key)}
				className="all_title"
			>
				<Tabs.Tab eventKey="1" title={`전체 (${reqClient.length})`} />
				<Tabs.Tab eventKey="2" title={`진행중 (${reqClient.filter(r => r.sa_approval_status === '진행중').length})`} />
				<Tabs.Tab eventKey="3" title={`승인 (${reqClient.filter(r => r.sa_approval_status === '승인').length})`} />
				<Tabs.Tab eventKey="4" title="등록 요청" />
			</Tabs>

			{/* 로딩 중일 때 */}
			{/* Placeholder.Paragraph : 여러 줄의 더미 텍스트 박스. 스켈레톤(skeleton) 로딩 UI를 자동 생성 */}
			{isLoading ? (
				<Container>
					<Placeholder.Paragraph rows={12} />
					<Loader center content="불러오는중..." />
				</Container>
			) : (
				<>
				{(activeTab === "1" || activeTab === "2" || activeTab === "3") && (
				<Table
					height={400}
					width={1200}
					margin='0 auto'
					data={filteredList}
					onRowClick={rowData => {
						// console.log(rowData);
					}}
				>

					<Column width={70} className="text_center">
						<HeaderCell style={styles}>순번</HeaderCell>
						<Cell>{(rowData) => rowData.rownum}</Cell>
					</Column>
					
					<Column width={100} className="text_center">
						<HeaderCell style={styles}>승인상태</HeaderCell>
						<Cell>{(rowData) => rowData.sa_approval_status}</Cell>
					</Column>


					<Column width={120} className="text_center">
						<HeaderCell style={styles}>거래처명</HeaderCell>
						<Cell>{(rowData) => rowData.sc_client_name}</Cell>
					</Column>

					<Column width={120} className="text_center">
						<HeaderCell style={styles}>대표자명</HeaderCell>
						<Cell>{(rowData) => rowData.sc_ceo}</Cell>
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell style={styles}>사업자등록번호</HeaderCell>
						<Cell>{(rowData) => rowData.sc_biz_num}</Cell>
					</Column>

					<Column width={170} className="text_center">
						<HeaderCell style={styles}>이메일</HeaderCell>
						<Cell>{(rowData) => rowData.sc_email}</Cell>
					</Column>

					<Column width={170} className="text_center">
						<HeaderCell style={styles}>연락처</HeaderCell>
						<Cell>{(rowData) => rowData.sc_tel}</Cell>
					</Column>

					<Column width={170} className="text_center">
						<HeaderCell style={styles}>등록일</HeaderCell>
						<Cell>{(rowData) => rowData.sc_date}</Cell>
					</Column>

					<Column width={70} className="text_center">
						<HeaderCell style={styles}>상세보기</HeaderCell>
						<Cell>
							{(rowData) => (
							<Button color="green" appearance="ghost" size="xs" onClick={() => detailReqClient(rowData.sc_id)} style={{ marginTop: -7 }}>
								조회
							</Button>
							)}
						</Cell>
					</Column>
				</Table> )}
				
				{activeTab === "4" && <SellRequestClient />}
			</>
			)}
        </div>
    );
};

export default SellRequestClientList;