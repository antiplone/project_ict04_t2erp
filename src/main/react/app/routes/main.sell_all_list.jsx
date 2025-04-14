import { Table, Button, Tabs, Message, ButtonToolbar, Checkbox, Modal,
		InputGroup, Input } from 'rsuite';
// import SearchIcon from '@rsuite/icons/Search';
import React, { useState, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
import SellSalesInvoice from '#components/sell/SellSalesInvoice.jsx';
import SellSlipAll from '#components/sell/SellSlipAll';
import "../components/common/Sell_maintitle.css";
import AppConfig from "#config/AppConfig.json";

const { Column, HeaderCell, Cell } = Table;

// const confirm = ['미확인', '결재중', '완료'].map(
// 	confirmChk => ({ label: confirmChk, value: confirmChk })
//   );

  /* 결재 여부 - 선택 데이터 */
const confirm = ['미확인', '결재중', '완료'].map(
	(confirmChk) => ({ // 이렇게 하면, 둘다 같게 들어가서, 라벨따로 값따로 안넣어줘도 됩니다.
		label: confirmChk, 
		value: confirmChk,
	})
);

const sell_all_list = () => {

	const navigate = useNavigate();

	// '거래명세서' 모달
	const [open1, setOpen1] = React.useState(false);
	const handleOpen1 = () => setOpen1(true);
	const handleClose1 = () => setOpen1(false);

	// '불러온 전표' 모달
	const [open2, setOpen2] = React.useState(false);
	const handleOpen2 = () => setOpen2(true);
	const handleClose2 = () => setOpen2(false);

	// 날짜별로 No. 붙이기
	const getNumberedList = (data) => {
		let result = [];
		let currentDate = null;	// 현재 처리 중인 날짜
		let count = 0;
		let seen = new Set(); // 날짜+주문번호 중복 체크용

		data.forEach(item => {
			const key = `${item.order_date}_${item.order_no}`;

			// 날짜 바뀌면 count 초기화
			if (item.order_date !== currentDate) {
				currentDate = item.order_date;
				count = 1;
			}

			// 이미 본 주문번호는 스킵
			if (seen.has(key)) return;
			seen.add(key);

			// 동일 주문번호 + 날짜로 묶인 품목 수 체크
			const sameOrderItems = data.filter(x =>
				x.order_no === item.order_no &&
				x.order_date === item.order_date
			);

			const firstItemName = sameOrderItems[0].item_name;

			// 품목이 여러 개일 경우 "첫 품목명 외" 형식으로 만들기
			const displayName = sameOrderItems.length > 1
				? `${firstItemName} 외`
				: firstItemName;

			result.push({
				...item,
				date_no: count++,
				item_display: displayName
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

	return (
		<div>
			<Message type="success" className="main_title">
				판매조회
			</Message>

			{/* 검색바 */}
            <div className="status_search_bar">
				<InputGroup >
					<Input />
					<InputGroup.Button>
						{/* <SearchIcon /> */}
					</InputGroup.Button>
				</InputGroup>
            </div>

			<Tabs defaultActiveKey="1" className="all_title">
				<Tabs.Tab eventKey="1" title="전체">
				</Tabs.Tab>
				<Tabs.Tab eventKey="2" title="결재중">
				</Tabs.Tab>
				<Tabs.Tab eventKey="3" title="미확인">
				</Tabs.Tab>
				<Tabs.Tab eventKey="4" title="확인">
				</Tabs.Tab>
			</Tabs>

			<Table 
				className="all_table"
				height={500}
				data={allList}
				onRowClick={rowData => {
					console.log(rowData);
				}}
			>	
			
			<Column width={50} className="all_text">
				<HeaderCell>선택</HeaderCell>
				<Cell><Checkbox className="all_checkbox" /></Cell>
			</Column>
			
			<Column width={130} className="all_text">
				<HeaderCell>등록일자_No.</HeaderCell>
				<Cell>
					{(rowData) => (
						<span 
							onClick={() => allListDetail(rowData.order_id)}
							style={{ cursor: 'pointer' }}
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

			<Column width={200}  className="all_text">
				<HeaderCell>품목명</HeaderCell>
				<Cell>
					{(rowData) => rowData.item_display}
				</Cell>
			</Column>

			<Column width={100} className="all_text">
				<HeaderCell>금액 합계</HeaderCell>
				<Cell>
					{(rowData) => new Intl.NumberFormat().format(rowData.total)}
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

			<Column width={100} className="all_text">
				<HeaderCell>회계반영 여부</HeaderCell>
				<Cell />
			</Column>

			{/* <Column width={150} >
				<HeaderCell className="all_text">결재</HeaderCell>
				<Cell className="all_chkText">
					<InputPicker placeholder="미확인" data={confirm} style={confirmStyles} />
				</Cell>
			</Column> */}

			<Column width={100} className="all_text">
				<HeaderCell>거래명세서</HeaderCell>
				<Cell>
					<Button appearance="link" onClick={handleOpen1}>
					조회
					</Button>
				</Cell>
			</Column>

			<Column width={100} className="all_text">
				<HeaderCell>불러온 전표</HeaderCell>
				<Cell>
					<Button appearance="link" onClick={handleOpen2}>
					조회
					</Button>
				</Cell>
			</Column>
			</Table>

			<Modal open={open1} onClose={handleClose1} style={{ width:800 }}>
				<Modal.Header>
				<Modal.Title>거래명세서</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SellSalesInvoice />
				</Modal.Body>
				<Modal.Footer>
				<Button onClick={handleClose1} appearance="primary">
					인쇄
				</Button>
				<Button onClick={handleClose1} appearance="subtle">
					닫기
				</Button>
				</Modal.Footer>
			</Modal>

			<Modal open={open2} onClose={handleClose2} style={{ width:800 }}>
				<Modal.Header>
				<Modal.Title>불러온 전표</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SellSlipAll />
				</Modal.Body>
				<Modal.Footer>
				<Button onClick={handleClose2} appearance="subtle">
					닫기
				</Button>
				</Modal.Footer>
			</Modal>

			<div className="parent">
  				<div className="child">
					<ButtonToolbar>
						<Link to="/main/sell_insert">
							<Button appearance="primary">판매 입력</Button>
						</Link>
						{/* <Button appearance="primary">저장</Button> */}
						<Button appearance="primary">선택 삭제</Button>
					</ButtonToolbar>
				</div>
			</div>
		</div>
  );
};


export default sell_all_list;
