import React, { useState, useMemo } from "react";
import { Button, ButtonToolbar, Message, DatePicker, Form, 
		InputGroup, Input, Table, InputPicker,
		InputNumber, toaster } from "rsuite";
import "#styles/sell.css";
import SellClientSearchModal from "#components/sell/SellClientSearchModal.jsx";
import SellEmployeeSearchModal from "#components/sell/SellEmployeeSearchModal.jsx";
import SellStorageSearchModal from "#components/sell/SellStorageSearchModal.jsx";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";
import ashBn from "#images/common/ashBn.png";
import SellItemSearchCountModal from "#components/sell/SellItemSearchCountModal.jsx";

// sell_insert => 판매 입력 페이지

const { Column, HeaderCell, Cell } = Table;

/* 거래유형 - 선택 데이터 */
const sellType = ["부과세율 적용", "부가세율 미적용"].map(
	(item) => ({
		label: item, 
		value: item,
	})
);

// RSuite Table => 편집 셀, 셀 하나를 렌더링하고, 데이터 수정할 수 있도록 input 필드 표시 (문자입력)
const EditableCell = ({ rowData, dataKey, onChange, editable, onDoubleClickCell, ...props }) => (
	<Cell {...props} onDoubleClick={() => onDoubleClickCell?.(rowData.id)}>
		{editable ? ( // editable ? 셀편집이 가능한지 여부, editable === true 편집가능 모드, editable === false 읽기 전용 모드 
			<Input
				size="xs"
				value={rowData[dataKey] || ''}
				onChange={(value) => onChange(rowData.id, dataKey, value)} // 사용자가 입력한 값 onchange를 통해 부모 컨포넌트로 전달
			/>
		) : (
			rowData[dataKey]
		)}
	</Cell>
);

// RSuite Table => 테이블 내에서 숫자를 수정할 수 있게 해준다. (숫자 전용 입력)
const EditableNumberCell = ({ rowData, dataKey, onChange, editable, ...props }) => (  // rowData  행 데이터, 물품정보 한건에 해당하는 정보
	<Cell {...props}>
		{editable ? (
			<InputNumber
				size="xs"
				value={rowData[dataKey] || 0}
				min={0} // 0보다 작을 수 없게 설정
				onChange={(value) => onChange(rowData.id, dataKey, value)}
			/>
		) : (
			rowData[dataKey]
		)}
	</Cell>
);

const Sellinsert = () => {

	// 현재 편집중인 셀
	const [currentEditId, setCurrentEditId] = useState(null);
	
	// 입력한 내역 저장
	const [sellAdd, setSellAdd] = useState([]);
	// 경고 메세지창
	const [warning, setWarning] = useState("");

	// 백엔드로 전달하기 위해 출하창고 저장
	const [shipmentOrderDate, setShipmentOrderDate] = useState(null);
	// 백엔드로 전달하기 위해 거래유형 저장
	const [transactionType, setTransactionType] = useState(null);

	// 거래처 모달 관리
	const [selectedClient, setSelectedClient] = useState(null);
	const [selectedClientName, setSelectedClientName] = useState(null);
	const [isClientModalOpen, setClientModalOpen] = useState(false);

	const handleClientSelect = (client_code, client_name) => {
        setSelectedClient(client_code);
		setSelectedClientName(client_name);
        setClientModalOpen(false);
    };

	// 담당자 모달 관리
	const [selectedIncharge, setSelectedIncharge] = useState(null);
	const [selectedInchargeName, setSelectedInchargeName] = useState(null);
	const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);

	const handleInchargeSelect = (e_id, e_name) => {
        setSelectedIncharge(e_id);
		setSelectedInchargeName(e_name);
        setInchargeModalOpen(false);
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
	const [isItemModalOpen, setItemModalOpen] = useState(false);

	const handleChange = (id, key, value) => {
		const nextData = [...sellAdd];
		const target = nextData.find(item => item.id === id);
		if (target) {
			target[key] = value;

			// Number(...) || 0는 null, undefined, '' 등의 경우에도 숫자 계산 가능하게 처리
			const price = Number(target.price) || 0;
			const quantity = Number(target.quantity) || 0;
			const stock = Number(target.stock_amount) || 0;

			// 수량 입력 시 또는 재고가 바뀌었을 때도 검사
			if (key === "quantity" || key === "stock_amount") {
				if (quantity > stock) {
					toaster.push(
						<Message showIcon type="warning">
							재고보다 많은 수량을 입력할 수 없습니다.
						</Message>,
						{ placement: "topCenter" }
					);
					// alert("재고보다 많은 수량을 입력할 수 없습니다.");
					target.quantity = stock; // 최대 재고로 자동 수정
				}
			}
			
			// 수량 또는 단가 바뀌었을 때 계산
			const supply = quantity * price;
			const vat = Math.floor(supply * 0.1); // 부가세 10%
			const total = supply + vat;

			target.supply = supply;
			target.vat = vat;
			target.total = total;

			setSellAdd(nextData);
		}
	};
	
	// 삭제
	const handleRemove = (id) => {
		const filtered = sellAdd.filter(order => order.id !== id);
        setSellAdd(filtered); // 필터링된 배열로 상태를 업데이트
	};

	const fetchURL = AppConfig.fetch['mytest'];
	
	// 입력한 값을 백엔드로 전달
	const submitSellInsert = (e) => {
		e.preventDefault();
		
		// 상단 필수 항목 체크
		if (
			!shipmentOrderDate ||
			!selectedIncharge ||
			!selectedInchargeName ||
			!selectedClient ||
			!selectedClientName ||
			!transactionType ||
			!selectedStorage ||
			!selectedStorageName ||
			sellAdd.length === 0
		) {
			toaster.push(
				<Message showIcon type="warning">
					판매 입력이 완료되지 않았습니다. <br />
					빈 항목을 입력해주세요.
				</Message>,
				{ placement: "topCenter" }
			);
			return;
		}

		// 하위 항목 필수 체크 (수량, 단가)
		const hasInvalidItem = sellAdd.some(item =>
			item.quantity === null || item.quantity === undefined || item.quantity <= 0 ||
			item.price === null || item.price === undefined || item.price <= 0
		);

		if (hasInvalidItem) {
			toaster.push(
				<Message showIcon type="warning">
					판매 입력이 완료되지 않았습니다. <br />
					수량과 단가는 0보다 커야 합니다.
				</Message>,
				{ placement: "topCenter" }
			);
			return;
		}

		const filteredSellAdd = sellAdd.map(({ status, id, ...rest }) => rest);

		const payload = {
			shipment_order_date: shipmentOrderDate,
			e_id: selectedIncharge,
			e_name: selectedInchargeName,
			client_code: selectedClient,
			client_name: selectedClientName,
			transaction_type: transactionType,
			storage_code: selectedStorage,
			storage_name: selectedStorageName,
			orderItemList: filteredSellAdd,
		};

		console.log("제출할 전체 데이터:", payload); // 확인용

		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/insert`, {
			method: "POST",
			headers: {
				"Content-Type":"application/json;charset=utf-8"
			},
			body: JSON.stringify(payload)
		})
		// 결과를 돌려받는 곳
		.then((res) => {
			console.log(1, res);

			if(res.status === 201) return res.json();   // 정상(201)이면 ture 리턴
			else return null;
		})
		.then((result) => {
			console.log('등록 결과:', result);
		
			if (typeof result === 'number' && result > 0) {
				alert("등록이 완료되었습니다.");
				window.location.reload();
			} else {
				alert("등록에 실패했습니다.");
			}
		})
		.catch(error => {
			console.log('실패', error);
			alert("서버 오류가 발생했습니다.");
		});
	}

	// '초기화' 버튼 - 전체 내용 리셋
	const handleResetForm = () => {
		setShipmentOrderDate(null);
		setTransactionType(null);
	
		setSelectedClient(null);
		setSelectedClientName(null);
		setClientModalOpen(false);
	
		setSelectedIncharge(null);
		setSelectedInchargeName(null);
		setInchargeModalOpen(false);
	
		setSelectedStorage(null);
		setSelectedStorageName(null);
		setStorageModalOpen(false);

		setSellAdd([]); // 하위 테이블 초기화만 추가
	};

	// 총액 계산
	const totalSum = useMemo(() => {
		return sellAdd.reduce((sum, row) => {
			const value = Number(row.total);
			return sum + (isNaN(value) ? 0 : value);
		}, 0);
	}, [sellAdd]);

	return (
		<div>
			<Message type="info" className="main_title">
      			판매 입력
    		</Message>

			<Form layout="horizontal">

			{/* 입력 상위 칸 */}
			<div className="add_final">

				<div className="form_div">
					<div className="add_div">
						<InputGroup className="insert_input">
							<InputGroup.Addon style={{ width: 90 }}>
							출하지시일
							</InputGroup.Addon>
							<DatePicker 
								name="shipment_order_date"
								value={shipmentOrderDate}
  								onChange={setShipmentOrderDate} />
						</InputGroup>
					</div>

					<div className="add_div">
						<InputGroup className="insert_inputBox">
							<InputGroup.Addon style={{ width: 90 }}>
								담당자
							</InputGroup.Addon>
							<Input
								placeholder='담당자'
								name="e_id"
								value={selectedIncharge || ""} readOnly
							/>
							<InputGroup.Addon tabIndex={-1} onClick={() => setInchargeModalOpen(true)}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								style={{ cursor: "pointer "}}
								/>
							</InputGroup.Addon>
						</InputGroup>
						<Input name="e_name" type="text" autoComplete="off" style={{ width: 150 }}
							value={selectedInchargeName || ""} readOnly />
					</div>

					<div className="add_div">
						<InputGroup className="insert_inputBox">
							<InputGroup.Addon style={{ width: 90 }}>
								거래처
							</InputGroup.Addon>
							<Input placeholder='거래처'
								name="client_code"
								value={selectedClient || ""} readOnly
							/>
							<InputGroup.Addon tabIndex={-1} onClick={() => setClientModalOpen(true)}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								style={{ cursor: "pointer "}}
								/>
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" style={{ width: 150 }}
							name="client_name"
							value={selectedClientName || ""} readOnly />
					</div>

				</div>

				<div className="form_div">
					<div className="add_div">
						<InputGroup className="insert_input">
							<InputGroup.Addon style={{ width: 90 }}>
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

					<div className="add_div">
						<InputGroup className="insert_inputBox">
							<InputGroup.Addon style={{ width: 90 }}>
								출하창고
							</InputGroup.Addon>
							<Input 
								placeholder='창고' 
								name="storage_code"
								value={selectedStorage || ""} readOnly
							/>
							<InputGroup.Addon tabIndex={-1} onClick={() => setStorageModalOpen(true)}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								style={{ cursor: "pointer "}}
								/>
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" style={{ width: 150 }}
							name="storage_name"
							value={selectedStorageName || ""} readOnly />
					</div>
				</div>

				<div className="form_div">
				<ButtonToolbar>
						<Button appearance="primary"
							// className="status_btn"
							onClick={() => {
								const newId = sellAdd.length > 0
											? Math.max(...sellAdd.map(item => item.id)) + 1
											: 1;
								const newItem = {
									id: newId,
									item_code: '',
									item_name: '',
									item_standard: '',
									quantity: 0,
									price: 0,
									supply: 0,
									vat: 0,
									total: 0,
									status: 'EDIT'
								};
								setSellAdd(prev => [newItem, ...prev]);
								// setEditingRowId(newId);
							}}
						>
							입력 추가
						</Button>

						<Button appearance="primary" type="submit" onClick={handleResetForm}>
							초기화
						</Button>
					</ButtonToolbar>
				</div>

						<hr />

						{/* 입력 하위 칸 */}
						<div className="addTabel">
						<Table height={400} data={sellAdd}>
							
							<Column width={150}>
								<HeaderCell>물품코드</HeaderCell>
								<EditableCell
								dataKey="item_code"
								editable
								onDoubleClickCell={(id) => {
									setCurrentEditId(id); // 현재 편집 중인 행 저장
									setItemModalOpen(true);
								}} 
								onChange={handleChange}
								>
								</EditableCell>
							</Column>

							<Column width={150}>
								<HeaderCell>물품명</HeaderCell>
								<EditableCell
								dataKey="item_name"
								onDoubleClickCell={(id) => {
									setCurrentEditId(id); // 현재 편집 중인 행 저장
									setItemModalOpen(true);
								}} 
								onChange={handleChange}
								editable
								/>
							</Column>

							<Column width={150}>
								<HeaderCell>규격</HeaderCell>
								<EditableCell
								dataKey="item_standard"
								onDoubleClickCell={(id) => {
									setCurrentEditId(id); // 현재 편집 중인 행 저장
									setItemModalOpen(true);
								}} 
								onChange={handleChange}
								editable
								/>
							</Column>
						
						<Column width={100}>
							<HeaderCell>재고</HeaderCell>
							<EditableCell
							dataKey="stock_amount"
							/>
						</Column>

						<Column width={100}>
							<HeaderCell>수량</HeaderCell>
							<EditableNumberCell
							dataKey="quantity"
							dataType="number"
							onChange={handleChange}
							editable
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>단가</HeaderCell>
							<EditableNumberCell
								dataKey="price"
								dataType="number"
								onChange={handleChange}
								editable
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>공급가액</HeaderCell>
							<Cell dataKey="supply" />
						</Column>

						<Column width={150}>
							<HeaderCell>부가세</HeaderCell>
							<Cell dataKey="vat" />
						</Column>

						<Column width={150}>
							<HeaderCell>총액</HeaderCell>
							<Cell dataKey="total" />
						</Column>


						<Column width={100}>
							<HeaderCell>삭제</HeaderCell>
							<Cell>
								{rowData => (
									<img
										src={ashBn}
										alt="돋보기"
										width={20}
										height={20}
										onClick={() => handleRemove(rowData.id)}
										style={{ cursor: "pointer" }}
									/>
								)}
                   			 </Cell>
						</Column>
					</Table>
					</div>
				

					<div className="resultContainer">
						<div className="resultBtn">
							<ButtonToolbar>
								<Button appearance="primary" onClick={submitSellInsert}>저장</Button>
								{/* <Button appearance="primary" onClick={handleResetForm}>다시 작성</Button> */}
							</ButtonToolbar>
						</div>

						<div className="total">
							총액 합계: {totalSum.toLocaleString()} 원
						</div>
					</div>
				</div>
					<hr></hr>
				
				<SellClientSearchModal
					style={{ margin: 'auto' }}
					onClientSelect={handleClientSelect}	// client_code, client_name 받기
					handleOpen={isClientModalOpen}
					handleClose={() => setClientModalOpen(false)}
				/>

				<SellEmployeeSearchModal
					style={{ width: 700, margin: 'auto' }}
					onInchargeSelect={handleInchargeSelect}	// e_id, e_name 받기
					handleOpen={isInchargeModalOpen}
					handleClose={() => setInchargeModalOpen(false)}
				/>

				<SellStorageSearchModal
					onStorageSelect={handleStorageSelect}	// storage_code, storage_name 받기
					handleOpen={isStorageModalOpen}
					handleClose={() => setStorageModalOpen(false)}
				/>

				<SellItemSearchCountModal
					isOpen={isItemModalOpen}
					handleClose={() => setItemModalOpen(false)}
					storage_code={selectedStorage}
					onItemSelect={(item_code, item_name, item_standard, stock_amount) => {
						handleChange(currentEditId, "item_code", item_code);
						handleChange(currentEditId, "item_name", item_name);
						handleChange(currentEditId, "item_standard", item_standard);
						handleChange(currentEditId, "stock_amount", stock_amount); 
						setItemModalOpen(false);
					}}
				/>

			{/* <hr></hr> */}
			</Form>
		</div>
		
	);
};

export default Sellinsert;