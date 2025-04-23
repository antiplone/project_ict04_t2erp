
import React, { useState, useEffect } from "react";
import { Button, ButtonToolbar, Message, Form, 
		 InputGroup, Input, Table, InputPicker,
		  DateRangePicker} from "rsuite";
import SellEmployeeSearchModal from "#components/sell/SellEmployeeSearchModal.jsx";
import SellClientSearchModal from "#components/sell/SellClientSearchModal.jsx";
import SellStorageSearchModal from "#components/sell/SellStorageSearchModal.jsx";
import SellItemSearchModal from "#components/sell/SellItemSearchModal.jsx";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";
import "#styles/sell.css";
// sell_status_select => 판매 현황 페이지

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
	const [orderDate, setOrderDate] = useState(null);
	const [transactionType, setTransactionType] = useState(null);

	// 담당자 모달 관리
	const [selectedIncharge, setSelectedIncharge] = useState(null);
	const [selectedInchargeName, setSelectedInchargeName] = useState(null);
	const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);

	const handleInchargeSelect = (e_id, e_name) => {
		setSelectedIncharge(e_id);
		setSelectedInchargeName(e_name);
		setInchargeModalOpen(false);
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

	// 창고 모달 관리
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [selectedStorageName, setSelectedStorageName] = useState(null);
	const [isStorageModalOpen, setStorageModalOpen] = useState(false);

	const handleStorageSelect = (storage_code, storage_name) => {
		setSelectedStorage(storage_code);
		setSelectedStorageName(storage_name);
		setStorageModalOpen(false);
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

	// 날짜 별로 순번 붙이기 (동일한 날짜+동일 주문건이면 동일한 No.)
	const getNumberedList = (data) => {
		let result = [];
	
		// 정렬 (날짜 내림차순 → 주문번호 오름차순)
		const sortedData = [...data].sort((a, b) => {
			if (a.order_date > b.order_date) return -1;
			if (a.order_date < b.order_date) return 1;
			if (a.order_id < b.order_id) return -1;
			if (a.order_id > b.order_id) return 1;
			return 0;
		});
	
		let currentOrderDate = null;
		let count = 1;  // 날짜별 순번 초기화
	
		// 날짜별로 순번 붙이기
		sortedData.forEach((item, index) => {
			// 날짜가 바뀌면 순번 1부터 시작
			if (item.order_date !== currentOrderDate) {
				currentOrderDate = item.order_date;
				count = 1;
			}
	
			// 같은 날짜 + 같은 주문번호라면 같은 순번을 유지
			if (index > 0 && item.order_date === sortedData[index - 1].order_date && item.order_id === sortedData[index - 1].order_id) {
				result.push({
					...item,
					date_no: count - 1,  // 이전의 순번 그대로 사용
					item_display: item.item_name
				});
			} else {
				// 날짜가 바뀌었거나 주문번호가 달라졌으면 순번 증가
				result.push({
					...item,
					date_no: count,  // 새로운 순번 부여
					item_display: item.item_name
				});
				count++;  // 순번 증가
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
	
	
	// 검색한 리스트 조회하기 : 검색값을 백엔드로 전달
	const [searchResultList, setSearchResultList] = useState([]);
	
	const [isSearched, setIsSearched] = useState(false);

	// 날짜를 UTC 기준이 아닌 로컬 시간대에 맞게 처리 
	const formatDate = (date) => {
		if (!date) return null;
		const localDate = new Date(date);
		localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset()); // 로컬 시간대에 맞게 조정
		return localDate.toISOString().slice(0, 10); // 날짜만 추출
	};

	const submitStatusSearch = (e) => {
		e.preventDefault();
		
		const payload = {
			order_date_start: formatDate(orderDate && orderDate[0] ? orderDate[0] : null),
  			order_date_end: formatDate(orderDate && orderDate[1] ? orderDate[1] : null),
			e_id: selectedIncharge,
			client_code: selectedClient,
			transaction_type : transactionType,
			storage_code: selectedStorage,
			item_code: selectedItem,
		};
	
		console.log("제출할 전체 데이터:", payload); // 확인용
	
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/statusSearchList`, {
			method: "POST", // 보통 검색 필터는 POST로 보냄. GET은 URL에 붙여야 해서 복잡함.
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("검색 결과:", data);
				const searchNumbered = getNumberedList(data);
				setSearchResultList(searchNumbered);
				setIsSearched(true);
			})
			.catch((error) => {
				console.error("검색 오류:", error);
			});
	};

	// 초기화 버튼 (전체 리스트로 돌아가기)
	const statusList_btn = () => {
		setSearchResultList([]);
		setIsSearched(false); // 검색 상태 해제
	}
	
	// 검색 필터 초기화
	const submitStatusReset = () => {
		setOrderDate(null);
		setSelectedClient(null);
		setSelectedClientName(null);
		setSelectedIncharge(null);
		setSelectedInchargeName(null);
		setTransactionType(null);
		setSelectedStorage(null);
		setSelectedStorageName(null);
		setSelectedItem(null);
		setSelectedItemName(null);
	}

	return (
		<div>
			
			<Message type="success" className="main_title">
				판매현황
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
							<DateRangePicker 
								name="order_date"
								value={orderDate}
								onChange={setOrderDate}
							/>
						</InputGroup>
					</div>

					<div className="status_div">
						<InputGroup className="status_inputBox">
							<InputGroup.Addon style={{ width: 80 }}>
								담당자
							</InputGroup.Addon>
							<Input
								placeholder='담당자'
								name="e_id"
								value={selectedIncharge || ""} readOnly
								// value={selectedIncharge ? selectedIncharge.em_name : ""}
							/>
							<InputGroup.Addon tabIndex={-1}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								onClick={() => setInchargeModalOpen(true)}
								style={{ cursor: "pointer "}}
								/>
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
							<InputGroup.Addon tabIndex={-1}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								onClick={() => setClientModalOpen(true)}
								style={{ cursor: "pointer "}}
								/>
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
							<InputGroup.Addon tabIndex={-1}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								onClick={() => setStorageModalOpen(true)}
								style={{ cursor: "pointer "}}
								/>
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
							<InputGroup.Addon tabIndex={-1}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								onClick={() => setItemModalOpen(true)}
								style={{ cursor: "pointer "}}
								/>
							</InputGroup.Addon>
							</InputGroup>
							<Input name="item_name" type="text" autoComplete="off" className="status_inputBox2"
								value={selectedItemName || ""} readOnly />
						
					</div>
				</div>

					<div className="form_div">
					<ButtonToolbar>
						<Button appearance="primary" type="submit" onClick={submitStatusSearch}>
							검색
						</Button>
						<Button appearance="primary" type="submit" onClick={submitStatusReset}>
							검색창 초기화
						</Button>
					</ButtonToolbar>
					</div>
						<hr />

					<div className="addTabel">
							{isSearched && searchResultList.length === 0 ? (
								<div style={{ padding: '20px', textAlign: 'center', fontSize: '16px', color: 'gray' }}>
									해당 정보로 조회되는 리스트가 없습니다.
								</div>
							) : (
							<Table 
								height={400} 
								// data={statusData}
								data={isSearched ? searchResultList : statusData}
									// 검색 결과가 있으면 해당 데이터 보여주고, 없으면 전체 목록 보여주기
							>	

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
							
							<Column width={100} className="all_text">
								<HeaderCell>출하여부</HeaderCell>
								<Cell>
									{(rowData) => rowData.income_confirm === null ? 'N' : rowData.income_confirm}
								</Cell>
							</Column>
						</Table>)}
					</div>

					<div className="resultBtn">
						<ButtonToolbar>
							<Button appearance="primary" onClick={statusList_btn}>내역 초기화</Button>
						</ButtonToolbar>
					</div>

					<hr></hr>
					<SellEmployeeSearchModal
						onInchargeSelect={handleInchargeSelect}	// e_id, e_name 받기
						handleOpen={isInchargeModalOpen}
						handleClose={() => setInchargeModalOpen(false)}
					/>

					<SellClientSearchModal
						onClientSelect={handleClientSelect}	// client_code, client_name 받기
						handleOpen={isClientModalOpen}
						handleClose={() => setClientModalOpen(false)}
					/>

					<SellStorageSearchModal
						onStorageSelect={handleStorageSelect}	// storage_code, storage_name 받기
						handleOpen={isStorageModalOpen}
						handleClose={() => setStorageModalOpen(false)}
					/>

					<SellItemSearchModal
						onItemSelect={handleItemSelect}
						handleOpen={isItemModalOpen}
						handleClose={() => setItemModalOpen(false)}
					/>
				</Form>
			</div>
			{/* <hr></hr> */}

		</div>
		
	);
};

export default sell_status_select;