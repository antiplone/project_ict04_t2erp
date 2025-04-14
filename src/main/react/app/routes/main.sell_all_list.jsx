import { Table, Button, Tabs, Message, ButtonToolbar, Checkbox, Modal, InputPicker,
		InputGroup, Input } from 'rsuite';
// import SearchIcon from '@rsuite/icons/Search';
import mock from './sell_mock';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
		label: confirmChk, // Eugenia
		value: confirmChk, // Eugenia
	})
);

const confirmStyles = { width: 100, marginBottom: 0 };

const sell_all_list = () => {

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
		let currentDate = null;	// 현재 기준이 되는 날짜를 저장할 변수. 처음엔 null로 시작.
		let count = 0;			// 같은 날짜 내에서 몇 번째 항목인지 세는 카운터
	
		return data.map((item) => {
			// 현재 아이템의 날짜가 이전 아이템과 다르면 (날짜가 바뀌었으면)
			if (item.order_date !== currentDate) {
				currentDate = item.order_date;	// 기준 날짜를 현재 날짜로 바꾸고
				count = 1;		// 첫 번째 항목이니까 count는 1부터 시작
			} else {
				count++;	// 날짜가 같으면 같은 날짜의 두 번째, 세 번째...로 증가
			}
		
			return {
				...item,
				date_no: count	// 새로 붙인 일련번호 추가
			};
		});
	};
  
	// 전체 리스트
	const [allList, setAllList] = useState([]);

		useEffect(() => {
			fetch("http://localhost:8081/sell/allList", {
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

			<Table className="all_table"
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
				{(rowData) => `${rowData.order_date}_${rowData.date_no}`}
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
					{(rowData) => rowData.item_name}
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
