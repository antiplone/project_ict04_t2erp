
import React, { useState, useEffect } from "react";
import { Button, ButtonToolbar, Message, DatePicker, Form, 
		 InputGroup, AutoComplete, HStack, Input, Table, InputPicker,
		 IconButton, InputNumber, DateRangePicker} from "rsuite";
import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { mockUsers } from './sell_mock4';
//import SearchIcon from '@rsuite/icons/Search';
import "../components/common/Sell_maintitle.css";
import SellEmployeeSearchModal from "#components/sell/SellEmployeeSearchModal.jsx";
import SellClientSearchModal from "#components/sell/SellClientSearchModal.jsx";
import SellStorageSearchModal from "#components/sell/SellStorageSearchModal.jsx";
import SellItemSearchModal from "#components/sell/SellItemSearchModal.jsx";
import AppConfig from "#config/AppConfig.json";

const { Column, HeaderCell, Cell } = Table;

/* 거래유형 - 선택 데이터 */
const sellType = ["부과세율 적용", "부가세율 미적용"].map(
	(item) => ({
		label: item, 
		value: item,
	})
);

const sell_status_select = () => {

	
	// 백엔드로 전달하기 위해 출하창고, 거래유형타입 저장
	const [shipmentOrderDate, setShipmentOrderDate] = useState(null);
	const [transactionType, setTransactionType] = useState(null);

	// 담당자 모달 관리
	const [selectedIncharge, setSelectedIncharge] = useState(null);
	const [selectedInchargeName, setSelectedInchargeName] = useState(null);
	const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);

	const handleInchargeSelect = (e_id, e_name) => {
		setSelectedIncharge(e_id);
		setSelectedInchargeName(e_name);
		setClientModalOpen(false);
	};

	const handleOpenInchargeModal = () => {
		setInchargeModalOpen(true);
	};

	// 거래처 모달 관리
	const [selectedClient, setSelectedClient] = useState(null);
	const [selectedClientName, setSelectedClientName] = useState(null);
	const [isClientModalOpen, setClientModalOpen] = useState(false);

	const handleClientSelect = (client_code, client_name) => {
		setSelectedClient(client_code);
		setSelectedClientName(client_name);
		setClientModalOpen(false);
	};

	const handleOpenClientModal = () => {
		setClientModalOpen(true);
	};

	// 창고 모달 관리
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [selectedStorageName, setSelectedStorageName] = useState(null);
	const [isStorageModalOpen, setStorageModalOpen] = useState(false);

	const handleStorageSelect = (storage_code, storage_name) => {
		setSelectedStorage(storage_code);
		setSelectedStorageName(storage_name);
		setStorageModalOpen(false);
	};
	
	const handleOpenStorageModal = () => {
		setStorageModalOpen(true);
	};

	// 물품 검색 모달 관리
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemName, setSelectedItemName] = useState(null);
	const [isItemModalOpen, setItemModalOpen] = useState(false);

	const handleItemSelect = (item_code, item_name) => {
		setSelectedItem(item_code);
		setSelectedItemName(item_name);
		setItemModalOpen(false);
	};

	const handleOpenItemModal = () => {
		setItemModalOpen(true);
	};

	// 날짜별로 No. 붙이기
	const getNumberedList = (data) => {
		let result = [];

		// 최신 날짜가 먼저 오도록 내림차순 정렬
		const sortedData = [...data].sort((a, b) => {
			if (a.order_date > b.order_date) return -1;
			if (a.order_date < b.order_date) return 1;
			if (a.order_no < b.order_no) return -1;
			if (a.order_no > b.order_no) return 1;
			return 0;
		});

		let currentOrderDate = null;
		let count = 1;
		let seen = new Set();

		sortedData.forEach((item) => {
			const key = `${item.order_date}_${item.order_no}`;

			// 날짜가 바뀌면 count 초기화
			if (item.order_date !== currentOrderDate) {
				currentOrderDate = item.order_date;
				count = 1;
				seen = new Set(); // 날짜가 바뀌면 seen도 초기화
			}

			if (!seen.has(item.order_no)) {
				seen.add(item.order_no);

				const sameOrderItems = sortedData.filter(
					(x) => x.order_date === item.order_date && x.order_no === item.order_no
				);

				const itemNames = sameOrderItems.map((x) => x.item_name).join(", ");

				sameOrderItems.forEach((entry) => {
					result.push({
						...entry,
						date_no: count,
						item_display: itemNames
					});
				});

				count++;
			}
		});

		return result;
	};

	const [statusData, setStatusData] = useState([]);

	// 전체 리스트
	const fetchURL = AppConfig.fetch['mytest'];
	
			useEffect(() => {
				fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allList`, {
					method: "GET"
				})
				.then(res => res.json())
				.then(res => {
					console.log(1, res);
					const numbered = getNumberedList(res);
					setStatusData(numbered);
				});
			}, []);

	return (
		<div>
			
			<Message type="success" className="main_title">
				판매 현황
			</Message>
			
			{/* 입력 상위 칸 */}
			
			<div className="result_final">
			
				<Form className="addForm" layout="inline">

				<div className="form_div">
					<div className="status_div">
						<InputGroup className="status_input">
							<InputGroup.Addon style={{ width: 80 }}>
								등록일자
							</InputGroup.Addon>
							<DateRangePicker />
						</InputGroup>
					</div>

					<div className="status_div">
						<InputGroup className="status_inputBox">
							<InputGroup.Addon style={{ width: 80 }}>
								담당자
							</InputGroup.Addon>
							<Input
								placeholder='담당자 입력'
								name="e_id"
								value={selectedIncharge || ""} readOnly
								// value={selectedIncharge ? selectedIncharge.em_name : ""}
							/>
							<InputGroup.Addon onClick={handleOpenInchargeModal}>
								{/* <SearchIcon /> */}
							</InputGroup.Addon>
						</InputGroup>
						<Input 
							name="e_name" type="text" autoComplete="off" className="status_inputBox2"
							value={selectedInchargeName || ""} readOnly />
					</div>

					<div className="status_div">
						<InputGroup className="status_inputBox">
							<InputGroup.Addon style={{ width: 80 }}>
								거래처
							</InputGroup.Addon>
							<Input 
								placeholder='거래처' 
								name="client_code"
								value={selectedClient || ""} readOnly
							/>
							<InputGroup.Addon onClick={handleOpenClientModal}>
								{/* <SearchIcon /> */}
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" className="status_inputBox2"
								name="client_name"
								value={selectedClientName || ""} readOnly 
						/>
					</div>
				</div>

				<div className="form_div">
					<div className="status_div">
						<InputGroup className="status_input">
							<InputGroup.Addon style={{ width: 80 }}>
								거래유형
							</InputGroup.Addon>
							<InputPicker
								placeholder='거래유형 선택'
								name="transaction_type"
								data={sellType}
								value={transactionType}
								onChange={setTransactionType}
								style={{ width: 224, border: 'none', height: 38}}
							/>
						</InputGroup>
					</div>

					<div className="status_div">
						<InputGroup className="status_inputBox">
							<InputGroup.Addon style={{ width: 80 }}>
								출하창고
							</InputGroup.Addon>
							<Input 
								placeholder='출하창고' 
								name="storage_code"
								value={selectedStorage || ""} readOnly
								/>
							<InputGroup.Addon onClick={handleOpenStorageModal}>
									{/* <SearchIcon onClick={handleOpenStorageModal} /> */}
								</InputGroup.Addon>
							</InputGroup>
							<Input type="text" autoComplete="off" className="status_inputBox2"
								name="storage_name"
								value={selectedStorageName || ""} readOnly 
							/>
					</div>

					<div className="status_div">
						<InputGroup className="status_inputBox">
							<InputGroup.Addon style={{ width: 80 }}>
								품목코드
							</InputGroup.Addon>
							<Input 
								placeholder='품목코드' 
								name="item_code"
								value={selectedItem || ""} readOnly
							/>
							<InputGroup.Addon tabIndex={-1} onClick={handleOpenItemModal}>
								{/* <SearchIcon  /> */}
							</InputGroup.Addon>
							</InputGroup>
							<Input name="customer_1" type="text" autoComplete="off" className="status_inputBox2"
								value={selectedItemName || ""} readOnly />
						
					</div>
				</div>

					<div className="form_div">
					
						<Button appearance="primary" type="submit" style={{width: 100}}>
							검색
						</Button></div>
						<hr />

						<div className="addTabel">
						<Table height={400} data={statusData}>

						<Column width={150}>
							<HeaderCell>등록일자_No.</HeaderCell>
							<Cell>
								{(rowData) => `${rowData.order_date}_${rowData.date_no}`}
							</Cell>
						</Column>

						<Column width={200}>
							<HeaderCell>품목명</HeaderCell>
							<Cell>
								{(rowData) => rowData.item_display}
							</Cell>
						</Column>

						<Column width={100}>
							<HeaderCell>수량</HeaderCell>
							<Cell>
								{(rowData) => rowData.quantity}
							</Cell>
						</Column>

						<Column width={150}>
							<HeaderCell>단가</HeaderCell>
							<Cell>
								{(rowData) => new Intl.NumberFormat().format(rowData.price)}
								{/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
							</Cell>
						</Column>

						<Column width={150}>
							<HeaderCell>공급가액</HeaderCell>
							<Cell>
								{(rowData) => new Intl.NumberFormat().format(rowData.supply)}
								{/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
							</Cell>
						</Column>

						<Column width={150}>
							<HeaderCell>부가세</HeaderCell>
							<Cell>
								{(rowData) => new Intl.NumberFormat().format(rowData.vat)}
								{/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
							</Cell>
						</Column>

						<Column width={150}>
							<HeaderCell>금액합계</HeaderCell>
							<Cell>
								{(rowData) => new Intl.NumberFormat().format(rowData.total)}
								{/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
							</Cell>
						</Column>

						<Column width={150}>
							<HeaderCell>거래처명</HeaderCell>
							<Cell>
								{(rowData) => rowData.client_name}
							</Cell>
						</Column>

					

					</Table>
					</div>

					<div className="resultBtn">
					<ButtonToolbar >
						<Button appearance="primary" className="result_btn">인쇄</Button>
					</ButtonToolbar>
					</div>
					<hr></hr>
					<SellEmployeeSearchModal
						title="담당자 선택"
						confirm="확인"
						cancel="취소"
						onInchargeSelect={handleInchargeSelect}	// e_id, e_name 받기
						handleOpen={isInchargeModalOpen}
						handleColse={() => setInchargeModalOpen(false)}
					/>

					<SellClientSearchModal
						title="거래처 선택"
						confirm="확인"
						cancel="취소"
						onClientSelect={handleClientSelect}	// client_code, client_name 받기
						handleOpen={isClientModalOpen}
						handleColse={() => setClientModalOpen(false)}
					/>

					<SellStorageSearchModal
						title="창고 선택"
						confirm="확인"
						cancel="취소"
						onStorageSelect={handleStorageSelect}	// storage_code, storage_name 받기
						handleOpen={isStorageModalOpen}
						handleColse={() => setStorageModalOpen(false)}
					/>

					<SellItemSearchModal
						title="물품 선택"
						confirm="확인"
						cancel="취소"
						onItemSelect={handleItemSelect}
						handleOpen={isItemModalOpen}
						handleColse={() => setItemModalOpen(false)}
					/>
				</Form>
			</div>
			{/* <hr></hr> */}

		</div>
		
	);
};

export default sell_status_select;