import { Table, Button, Tabs, Message, ButtonToolbar, 
	Checkbox, Modal } from 'rsuite';
import React, { useState, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
import SellSlipAll from '#components/sell/SellSlipAll';
import "#styles/sell.css";
import AppConfig from "#config/AppConfig.json";
import SellInvoice from '#components/sell/SellInvoice.jsx';

// sell_all_list => 판매 조회 페이지

const { Column, HeaderCell, Cell } = Table;

  /* 결재 여부 - 선택 데이터 */
const confirm = ['미확인', '결재중', '완료'].map(
	(confirmChk) => ({ // 이렇게 하면, 둘다 같게 들어가서, 라벨따로 값따로 안넣어줘도 됩니다.
		label: confirmChk, 
		value: confirmChk,
	})
);

const sell_all_list = () => {

	const navigate = useNavigate();

	// 거래명세서 클릭 시 전달할 order_id, 등록일자_No 값을 저장
	const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);

	// '불러온 전표' 모달
	const [open1, setOpen1] = React.useState(false);
	const handleOpen1 = () => setOpen1(true);
	const handleClose1 = () => setOpen1(false);

	// '불러온 전표' 모달
	const [open2, setOpen2] = React.useState(false);
	const handleOpen2 = () => setOpen2(true);
	const handleClose2 = () => setOpen2(false);

	const getNumberedList = (data) => {
		let result = [];
		let groupedByDate = {};
	
		// 날짜별로 그룹핑
		data.forEach(item => {
			if (!groupedByDate[item.order_date]) {
				groupedByDate[item.order_date] = [];
			}
			groupedByDate[item.order_date].push(item);
		});
	
		// 날짜별로 처리
		Object.keys(groupedByDate).forEach(date => { 
			// groupedByDate : 날짜별로 데이터를 묶어둔 객체
			 // ex: { '2025-04-10': [item1, item2, ...], '2025-04-11': [item3, ...] }
			let orders = groupedByDate[date];	// 해당 날짜(date)의 전체 주문 데이터 배열
			let seenOrderIds = new Set();	// 중복된 주문(order_id)을 한 번만 처리하기 위해 사용
			let count = 1;
	
			orders.forEach(item => {
				if (seenOrderIds.has(item.order_id)) return;	 // 이미 처리한 주문번호(order_id)는 무시
				seenOrderIds.add(item.order_id);
	
				// 같은 order_id의 품목 모으기
				const sameOrderItems = orders.filter(x => x.order_id === item.order_id);
													// 주문번호와 item 주문번호가 같은 걸 배열로 만들기
													console.log("현재 처리 중인 order_id:", item.order_id);
													console.log("해당 order_id로 묶인 품목 수:", sameOrderItems.length);
													console.log("묶인 품목 목록:", sameOrderItems.map(x => x.item_name));
													const firstItemName = sameOrderItems[0].item_name;
				const displayName = sameOrderItems.length > 1
					? `${firstItemName} 외 ${sameOrderItems.length - 1}건`
					: firstItemName;
				
					// total_sum 계산 (동일 주문번호에 대한 합산)
			const totalSum = sameOrderItems.reduce((sum, curr) => sum + curr.total, 0);

				// 한 줄만 push
				result.push({
					...item,
					date_no: count,
					item_display: displayName,
					total_sum: totalSum // 총합을 추가
				});
	
				count++;
			});
		});

		return result;
	};
  
	const allListDetail = (order_id) => {
		navigate(`/main/sell_all_list_detail/${order_id}`)
	}

	// 전체 리스트
	const [allList, setAllList] = useState([]);

	const fetchURL = AppConfig.fetch['mytest'];

	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allList`, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			console.log(1, res);
			const numbered = getNumberedList(res);
			setAllList(numbered);
		});
	}, []);

	// 탭 상태(기본값 1 : 전체리스트)
	const [activeTab, setActiveTab] = useState("1");

	// 결재 상태에 따라 필터링 만들기
	const filteredList = allList.filter(row => {
		if (activeTab === "1") return true; // 전체
		if (activeTab === "2") return row.order_status === "결재중";
		if (activeTab === "3") return row.order_status === "승인";
		return false;
	  });
	
	return (
		<div>
			<Message type="success" className="main_title">
				판매조회
			</Message>

			<Tabs 
				activeKey={activeTab}
				onSelect={(key) => setActiveTab(key)}
				className="all_title"
			>
				<Tabs.Tab eventKey="1" title={`전체 (${allList.length})`} />
				<Tabs.Tab eventKey="2" title={`결재중 (${allList.filter(r => r.order_status === '결재중').length})`} />
				<Tabs.Tab eventKey="3" title={`승인 (${allList.filter(r => r.order_status === '승인').length})`} />
			</Tabs>

			<Table 
				className="all_table"
				height={500}
				data={filteredList}
				onRowClick={rowData => {
					console.log(rowData);
				}}
			>	
			
			<Column width={130} className="all_text">
				<HeaderCell>등록일자_No.</HeaderCell>
				<Cell>
					{(rowData) => (
						<span 
							onClick={() => allListDetail(rowData.order_id)}
							// style={{ cursor: 'pointer' }}
							className="allList-date"
						>
							{`${rowData.order_date}_${rowData.date_no}`}
						</span>
					)}
				</Cell>
			</Column>

			<Column width={130} className="all_text">
				<HeaderCell>출하지시일</HeaderCell>
				<Cell>
					{(rowData) => rowData.shipment_order_date}
				</Cell>
			</Column>

			<Column width={100}  className="all_text">
				<HeaderCell>거래처명</HeaderCell>
				<Cell>
					{(rowData) => rowData.client_name}
				</Cell>
			</Column>

			<Column width={250}  className="all_text">
				<HeaderCell>품목명</HeaderCell>
				<Cell>
					{(rowData) => rowData.item_display}
				</Cell>
			</Column>

			<Column width={100} className="all_text">
				<HeaderCell>금액 합계</HeaderCell>
				<Cell>
					{(rowData) => new Intl.NumberFormat().format(rowData.total_sum)}
					{/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
				</Cell>
			</Column>

			<Column width={150} className="all_text">
				<HeaderCell>거래유형</HeaderCell>
				<Cell>
					{(rowData) => rowData.transaction_type}
				</Cell>
			</Column>

			<Column width={150} className="all_text">
				<HeaderCell>출하창고명</HeaderCell>
				<Cell>
					{(rowData) => rowData.storage_name}
				</Cell>
			</Column>

			{/* <Column width={100} className="all_text">
				<HeaderCell>회계반영 여부</HeaderCell>
				<Cell />
			</Column> */}

			<Column width={100} className="all_text">
				<HeaderCell>출하여부</HeaderCell>
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
			
			<Column width={100} className="all_text">
				<HeaderCell>거래명세서</HeaderCell>
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

			<Column width={100} className="all_text">
				<HeaderCell>불러온 전표</HeaderCell>
				<Cell>
					<Button color="green" appearance="ghost" size="xs" onClick={handleOpen2}>조회</Button>
				</Cell>
			</Column>
			</Table>

			<Modal open={open1} onClose={handleClose1} style={{ width:1000 }}>
				<Modal.Header>
					<Modal.Title>거래명세서</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* selectedOrderInfo가 null이 아닐 때만 SellInvoice 컴포넌트를 렌더링하게 조건문을 추가 */}
					{selectedOrderInfo && (
						<SellInvoice 
							order_id={selectedOrderInfo.order_id}
							order_date={selectedOrderInfo.order_date}
							date_no={selectedOrderInfo.date_no}
						/>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleClose1} appearance="default">
						닫기
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal open={open2} onClose={handleClose2} style={{ width:800 }}>
				<Modal.Header>
					<Modal.Title>전표</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SellSlipAll />
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleClose2} appearance="default">
						닫기
					</Button>
				</Modal.Footer>
			</Modal>

			<div className="all_listBtn">
				<ButtonToolbar>
					<Link to="/main/sell_insert">
						<Button appearance="primary" className="allList_btn">판매 입력</Button>
					</Link>
				</ButtonToolbar>
			</div>
		</div>
  );
};


export default sell_all_list;
