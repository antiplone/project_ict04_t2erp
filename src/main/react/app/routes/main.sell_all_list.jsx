import { Table, Button, Tabs, Container, Placeholder, Loader, ButtonToolbar, Modal, toaster, Message } from 'rsuite';
import React, { useState, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
import SellSlipAll from '#components/sell/SellSlipAll';
import "#styles/sell.css";
import AppConfig from "#config/AppConfig.json";
import SellInvoice from '#components/sell/SellInvoice.jsx';
import MessageBox from '../components/common/MessageBox';

// sell_all_list => 판매 조회 페이지

const { Column, HeaderCell, Cell } = Table;

const sell_all_list = () => {

	const fetchURL = AppConfig.fetch['mytest'];
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);	// 로딩중일때
	const [selectedRow, setSelectedRow] = useState(null); // 전표 클릭 시 선택한 행

	// 전체 리스트
	const [allList, setAllList] = useState([]);

	// 거래명세서 클릭 시 전달할 'order_id, 등록일자_No' 값을 저장
	const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);

	// '거래명세서' 모달
	const [open1, setOpen1] = useState(false);
	const handleOpen1 = () => setOpen1(true);
	const handleClose1 = () => setOpen1(false);

	// '불러온 전표' 모달
	const [open2, setOpen2] = useState(false);
	// 전표 버튼 클릭 핸들러
	const handleOpen2 = () => {
		if (!selectedRow) return;

		if (selectedRow.order_status === '결재중') {
			toaster.push(
			<Message type="warning" showIcon closable>
				전표 처리 진행중입니다.
			</Message>,
			{ placement: 'topCenter' }
			);
			return;
		}

		setOpen2(true);
	};
	const handleClose2 = () => setOpen2(false);

	// 등록일자_No.과 대표 상품명 입력 설정하기
	const getNumberedList = (data) => {
		let result = [];	// 최종 결과를 담을 배열
		let groupedByDate = {};	// 날짜별로 데이터를 나눠서 담을 객체
	
		// 데이터를 날짜(order_date) 기준으로 그룹핑
		// ex: { '2025-04-10': [item1, item2, ...], '2025-04-11': [item3, ...] }
		data.forEach(item => {
			if (!groupedByDate[item.order_date]) {
				groupedByDate[item.order_date] = [];	// 해당 날짜 키가 없으면 초기화
			}
			groupedByDate[item.order_date].push(item);	// 해당 날짜 배열에 데이터 추가
		});
	
		// 날짜별로 처리
		Object.keys(groupedByDate).forEach(date => { 
			let orders = groupedByDate[date];	// 해당 날짜(date)의 전체 주문 데이터 배열
			let seenOrderIds = new Set();	// 이미 처리한 주문번호를 저장할 Set
			let count = 1;
			
			// 날짜별 주문 데이터 반복
			orders.forEach(item => {
				if (seenOrderIds.has(item.order_id)) return;	 // 이미 처리한 주문번호(order_id)는 무시
				seenOrderIds.add(item.order_id);
	
				// 같은 order_id의 품목 모으기
				const sameOrderItems = orders.filter(x => x.order_id === item.order_id);
				// console.log("현재 처리 중인 order_id:", item.order_id);
				// console.log("해당 order_id로 묶인 품목 수:", sameOrderItems.length);
				// console.log("묶인 품목 목록:", sameOrderItems.map(x => x.item_name));
				
				// 첫 번째 품목명을 표시용으로 사용
				const firstItemName = sameOrderItems[0].item_name;
				const displayName = sameOrderItems.length > 1 ?
									`${firstItemName} 외 ${sameOrderItems.length - 1}건`	// 여러 품목이면 요약
									: firstItemName;	// 한 개면 그냥 이름 그대로
					
				// 동일 주문번호로 묶인 항목들의 total 합계 계산
				// .reduce : 배열에 있는 값을 하나로 쌓아가면서 계산하는 함수 => sum: 누적된 합계, curr: 지금 처리 중인 항목(아이템1, 아이템2, ...)
				const totalSum = sameOrderItems.reduce((sum, curr) => sum + curr.total, 0);

				// 결과 담기
				// .push({ ... }) : 배열에 새로운 객체 하나씩 추가
				result.push({
					...item,
					date_no: count,
					item_display: displayName,
					total_sum: totalSum // 총 금액 합계
				});
		
				count++;
			});
		});

		return result;
	};

	// 전체 리스트 조회
	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allList`, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			// console.log(1, res);
			const numbered = getNumberedList(res);
			setAllList(numbered);
			setIsLoading(false);
		});
	}, []);
	  
	// 상세 클릭 시 order_id 넘겨주며 페이지 이동
	const allListDetail = (order_id) => {
		navigate(`/main/sell_all_list_detail/${order_id}`)
	}

	// 탭 상태(기본값 1 : 전체리스트)
	const [activeTab, setActiveTab] = useState("1");

	// 결재 상태에 따라 필터링 만들기
	const filteredList = allList.filter(row => {
		if (activeTab === "1") return true; // 전체
		if (activeTab === "2") return row.order_status === "결재중";
		if (activeTab === "3") return row.order_status === "승인";
		return false;
	  });
	
	const styles = {
        backgroundColor: '#f8f9fa',
    };

	return (
		<div>
			<MessageBox type="success" text="판매조회"/>
			
			<Tabs 
				activeKey={activeTab}
				onSelect={(key) => setActiveTab(key)}
			>
				<Tabs.Tab eventKey="1" title={`전체 (${allList.length})`} />
				<Tabs.Tab eventKey="2" title={`결재중 (${allList.filter(r => r.order_status === '결재중').length})`} />
				<Tabs.Tab eventKey="3" title={`승인 (${allList.filter(r => r.order_status === '승인').length})`} />
			</Tabs>

			{/* 로딩 중일 때 */}
			{/* Placeholder.Paragraph : 여러 줄의 더미 텍스트 박스. 스켈레톤(skeleton) 로딩 UI를 자동 생성 */}
			{isLoading ? (
			<Container>
				<Placeholder.Paragraph rows={15} />
				<Loader center content="불러오는중..." />
			</Container>
			) : (
			<Table 
				height={500}
				data={filteredList}	// 탭 상태에 따라 조건 필터한 데이터
				onRowClick={rowData => {
					// console.log(rowData);
				}}
			>	
			
			<Column width={170} className="text_center">
				<HeaderCell style={styles}>등록일자_No.</HeaderCell>
				<Cell>
					{(rowData) => (
						<span 
							onClick={() => allListDetail(rowData.order_id)}
							className="allList-date"
						>
							{`${rowData.order_date}_${rowData.date_no}`}
						</span>
					)}
				</Cell>
			</Column>
			
			<Column width={120} className="text_center">
				<HeaderCell style={styles}>주문번호</HeaderCell>
				<Cell>{(rowData) => rowData.order_id}</Cell>
			</Column>

			<Column width={170} className="text_center">
				<HeaderCell style={styles}>출하지시일</HeaderCell>
				<Cell>{(rowData) => rowData.shipment_order_date}</Cell>
			</Column>

			<Column width={170}>
				<HeaderCell className="text_center" style={styles}>거래처명</HeaderCell>
				<Cell className="text_left">{(rowData) => rowData.client_name}</Cell>
			</Column>

			<Column width={240}>
				<HeaderCell className="text_center" style={styles}>품목명</HeaderCell>
				<Cell className="text_left">{(rowData) => rowData.item_display}</Cell>
			</Column>

			<Column width={170}>
				<HeaderCell className="text_center" style={styles}>금액 합계</HeaderCell>
				<Cell style={{ textAlign: 'right' }}>{(rowData) => new Intl.NumberFormat().format(rowData.total_sum)}</Cell>
				{/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
			</Column>

			<Column width={200} className="text_center">
				<HeaderCell style={styles}>거래유형</HeaderCell>
				<Cell>{(rowData) => rowData.transaction_type}</Cell>
			</Column>

			<Column width={170} className="text_center">
				<HeaderCell style={styles}>출하창고명</HeaderCell>
				<Cell>{(rowData) => rowData.storage_name}</Cell>
			</Column>

		{/* <Column width={100} className="all_text">
				<HeaderCell>회계반영 여부</HeaderCell>
				<Cell />
			</Column> */}

			<Column width={170} className="text_center">
				<HeaderCell style={styles}>출하여부</HeaderCell>
				<Cell>
					{(rowData) => {
						if (rowData.income_confirm === null || rowData.income_confirm === 'N') {
							return '미완료'; // null 또는 'N'이면 미완료 표시
						} else if (rowData.income_confirm === 'Y') {
							return '완료'; // 'Y'이면 완료 표시
						}
					}}
				</Cell>
			</Column>
			
			<Column width={170} className="text_center">
				<HeaderCell style={styles}>거래명세서</HeaderCell>
				<Cell>
				{(rowData) => (
					<Button
					color="yellow"
					appearance="ghost"
					size="xs"
					onClick={() => {
						setSelectedOrderInfo({
							order_id: rowData.order_id,
							order_date: rowData.order_date,
							date_no: rowData.date_no
						  });  // 선택한 order_id, 등록일자_No 저장
						handleOpen1();                         // 모달 열기
					}}
					>
					조회
					</Button>
				)}
				</Cell>
			</Column>

			<Column width={170} className="text_center">
				<HeaderCell style={styles}>불러온 전표</HeaderCell>
				<Cell dataKey="order_id">
					{rowData => (
					<Button
						color="green"
						appearance="ghost"
						size="xs"
						onClick={() => {
						setSelectedRow(rowData); // 어떤 row인지 저장
						handleOpen2(); // 전표 핸들러 실행
						}}
					>
						조회
					</Button>
					)}
				</Cell>
			</Column>
			</Table>
			)}
			<Modal open={open1} onClose={handleClose1} 
				style={{ 
					position: 'fixed',
					left: '30%',
					width: 800 }}>
				<Modal.Header>
					<Modal.Title>거래명세서</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{/* selectedOrderInfo 값이 null이 아닐 때만 SellInvoice 컴포넌트를 렌더링 */}
					{selectedOrderInfo && (
						<SellInvoice 
							order_id={selectedOrderInfo.order_id}
							order_date={selectedOrderInfo.order_date}
							date_no={selectedOrderInfo.date_no}
						/>
					)}
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={handleClose1} appearance="default">닫기</Button>
				</Modal.Footer>
			</Modal>

			<Modal open={open2} onClose={handleClose2} 
				style={{ 
					position: 'fixed',
					left: '30%',
					width:800 }}>
				<Modal.Header>
					<Modal.Title>전표</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<SellSlipAll />
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={handleClose2} appearance="default">닫기</Button>
				</Modal.Footer>
			</Modal>

			<div className="all_listBtn">
				<ButtonToolbar>
					<Link to="/main/sell_insert">
						<Button appearance="ghost">판매 입력</Button>
					</Link>
				</ButtonToolbar>
			</div>
		</div>
  );
};


export default sell_all_list;
