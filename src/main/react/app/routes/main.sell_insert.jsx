import React, { useState, useEffect } from "react";
import { Button, ButtonToolbar, Message, DatePicker, Form, 
		 InputGroup, Input, Table, InputPicker,
		 IconButton, InputNumber } from "rsuite";
import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { mockUsers } from './sell_mock4';
// import SearchIcon from '@rsuite/icons/Search';
import "../components/common/Sell_maintitle.css";
import SellClientSearchModal from "#components/sell/SellClientSearchModal.jsx";
import SellEmployeeSearchModal from "#components/sell/SellEmployeeSearchModal.jsx";
import SellStorageSearchModal from "#components/sell/SellStorageSearchModal.jsx";
import SellItemSearchModal from "#components/sell/SellItemSearchModal.jsx";


const { Column, HeaderCell, Cell } = Table;

// 빈 테이블로 시작
const defaultData = [];

/* 거래유형 - 선택 데이터 */
const sellType = ["부과세율 적용", "부가세율 미적용"].map(
	(item) => ({
		label: item, 
		value: item,
	})
);

const sell_insert = () => {

	
	// 하위 입력칸을 초기 배열 상태로
	const [sellAdd, setSellAdd] = useState([]);

	// 백엔드로 전달하기 위해 출하창고, 거래유형타입 저장
	const [shipmentOrderDate, setShipmentOrderDate] = useState(null);
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

    const handleOpenClientModal = () => {
        setClientModalOpen(true);
    };

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
	//const [selectedItemName, setSelectedItemName] = useState(null);
	const [isItemModalOpen, setItemModalOpen] = useState(false);

	const handleItemSelect = (item_code, item_name, item_standard) => {
		console.log('handleItemSelect 실행됨', item_code, item_name, item_standard);

        //const nextData = sellAdd.map(item => ({ ...item })); // 깊은 복사
		const nextData = [...sellAdd]
		const targetIndex = nextData.findIndex(item => item.status === 'EDIT'); // 현재 편집 중인 행(status === 'EDIT')
		if (targetIndex !== -1) {
			nextData[targetIndex].item_code = item_code;
			nextData[targetIndex].item_name = item_name;
			nextData[targetIndex].item_standard = item_standard;
			setSellAdd(nextData);
			}
			setItemModalOpen(false);
    };

    const handleOpenItemModal = () => {
        setItemModalOpen(true);
    };
	console.log(selectedItem);
	// const [data, setData] = React.useState(defaultData);
	
	//const [activeEditId, setActiveEditId] = useState(null);
	

	const handleChange = (id, key, value) => {
		const nextData = [...sellAdd];
		const target = nextData.find(item => item.id === id);
		if (target) {
			target[key] = value;

			// Number(...) || 0는 null, undefined, '' 등의 경우에도 숫자 계산 가능하게 처리
			const quantity = Number(target.quantity) || 0;
			const price = Number(target.price) || 0;

			// 수량 또는 단가 바뀌었을 때 계산
			if (key === 'quantity' || key === 'price') {
				const supply = quantity * price;
				const vat = Math.floor(supply * 0.1); // 10% 부가세
				const total = supply + vat;

				target.supply = supply;
				target.vat = vat;
				target.total = total;
			}
		setSellAdd(nextData);
		}
	};
	
	// 수정
	const handleEdit = id => {
		const nextData = [...sellAdd];
		const activeItem = nextData.find(item => item.id === id);
		if(activeItem){
		activeItem.status = activeItem.status ? null : 'EDIT';

		setSellAdd(nextData);
		}
	};

	// 삭제
	const handleRemove = id => {
		setSellAdd(sellAdd.filter(item => item.id !== id));
	};

	// 입력한 값을 백단으로 전달
	const submitSellInsert = (e) => {
		e.preventDefault();
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

		fetch("http://localhost:8081/sell/insert", {
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
		.then((res) => {
			console.log('정상', res);

			// 등록 성공 시 페이지 새로고침
			if(res != 0) { 
				window.location.reload();
				alert("등록 성공!");
			}
			else alert("등록 실패");
		})
		// 예외처리
		.catch(error => {
			console.log('실패', error);
		})
	}

	// '다시 작성' 버튼 클릭 시 내용 리셋
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
		setSellAdd([]); // 하위 테이블 데이터 초기화
	};

	return (
		<div>
			<Message type="info" className="main_title">
      			판매입력
    		</Message>

			<Form layout="horizontal">

			{/* 입력 상위 칸 */}
			<div className="add_final">

				<div className="form_div">
					<div className="add_div">
						<InputGroup className="input">
							<InputGroup.Addon >
							출하지시일
							</InputGroup.Addon>
							<DatePicker 
								name="shipment_order_date"
								value={shipmentOrderDate}
  								onChange={setShipmentOrderDate} />
						</InputGroup>
					</div>

					<div className="add_div">
						<InputGroup className="input">
							<InputGroup.Addon >
								담당자
							</InputGroup.Addon>
							<Input
								placeholder='담당자 입력'
								name="e_id"
								value={selectedIncharge || ""} readOnly
							/>
							<InputGroup.Button tabIndex={-1} onClick={handleOpenInchargeModal}>
								{/* 모달 열기 버튼 */}
								{/* <SearchIcon onClick={handleOpenInchargeModal} /> */}
							</InputGroup.Button>
						</InputGroup>
						<Input name="e_name" type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
							value={selectedInchargeName || ""} readOnly />
					</div>

					<div className="add_div">
						<InputGroup className="input">
							<InputGroup.Addon>
								거래처
							</InputGroup.Addon>
							<Input placeholder='거래처'
								name="client_code"
								value={selectedClient || ""} readOnly
							/>
							<InputGroup.Addon onClick={handleOpenClientModal}>
								{/* <SearchIcon onClick={handleOpenClientModal} /> */}
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
							name="client_name"
							value={selectedClientName || ""} readOnly />
					</div>

				</div>

				<div className="form_div">
					<div className="add_div">
						<InputGroup className="input">
							<InputGroup.Addon>
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
						<InputGroup className="input">
							<InputGroup.Addon>
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
						<Input type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
							name="storage_name"
							value={selectedStorageName || ""} readOnly />
					</div>
				</div>

					<div className="addPlus">

						<Button style={{ width: 1240 }} 
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
							setActiveEditId(newId);
						}}
						>
						입력 추가하기
						</Button></div>
						<hr />

						{/* 입력 하위 칸 */}
						<div className="addTabel">
						<Table height={400} data={sellAdd}>

						<Column width={150}>
							<HeaderCell>물품코드</HeaderCell>
							<EditableCell
							dataKey="item_code"
							dataType="number"
							onClick={handleOpenItemModal}
							onChange={handleChange}
							onEdit={handleEdit}
							>
							</EditableCell>
						</Column>

						<Column width={150}>
							<HeaderCell>물품명</HeaderCell>
							<EditableCell
							dataKey="item_name"
							dataType="string"
							onClick={handleOpenItemModal}
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>규격</HeaderCell>
							<EditableCell
							dataKey="item_standard"
							dataType="string"
							onClick={handleOpenItemModal}
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={100}>
							<HeaderCell>수량</HeaderCell>
							<EditableCell
							dataKey="quantity"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>단가</HeaderCell>
							<EditableCell
							dataKey="price"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>공급가액</HeaderCell>
							<EditableCell
							dataKey="supply"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>부가세</HeaderCell>
							<EditableCell
							dataKey="vat"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>전체금액</HeaderCell>
							<EditableCell
							dataKey="total"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>


						<Column width={100}>
							<HeaderCell>Action</HeaderCell>
							<ActionCell dataKey="id" onEdit={handleEdit} onRemove={handleRemove} />
						</Column>
					</Table>
					</div>
					</div>

					<div className="sellAddBtn">
					<ButtonToolbar >
						<Button appearance="primary" className="sell_Btn" onClick={submitSellInsert}>저장</Button>
						<Button appearance="primary" className="sell_Btn" onClick={handleResetForm}>다시 작성</Button>
					</ButtonToolbar></div>
					<hr></hr>
				
				<SellClientSearchModal
					title="거래처 선택"
					confirm="확인"
					cancel="취소"
					onClientSelect={handleClientSelect}	// client_code, client_name 받기
					handleOpen={isClientModalOpen}
					handleColse={() => setClientModalOpen(false)}
				/>

				<SellEmployeeSearchModal
					title="담당자 선택"
					confirm="확인"
					cancel="취소"
					onInchargeSelect={handleInchargeSelect}	// e_id, e_name 받기
					handleOpen={isInchargeModalOpen}
					handleColse={() => setInchargeModalOpen(false)}
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
			{/* <hr></hr> */}
			</Form>
		</div>
		
	);
};

function toValueString(value, dataType) {
	return dataType === 'date' ? value?.toLocaleDateString() : value;
  }
  
  const fieldMap = {
	string: Input,
	number: InputNumber,
	date: DatePicker
  };
  
  const EditableCell = ({ rowData, dataType, dataKey, onChange, onEdit, ...props }) => {
	const editing = rowData.status === 'EDIT';
  
	const Field = fieldMap[dataType];
	const value = rowData[dataKey];
	const text = toValueString(value, dataType);
  
	return (
	  <Cell
		{...props}
		className={editing ? 'table-cell-editing' : ''}
		onDoubleClick={() => {
		  onEdit?.(rowData.id);	// 셀을 더블클릭하면 onEdit(rowId) 호출 → 편집 모드로 바뀜
		}}
		onClick={() => {
			props.onClick?.(); // EditableCell 컴포넌트 내부에서 onClick을 받아 처리하게 추가
		  }}
	  >
		{editing ? (
		  <Field
			value={value}	// defaultValue는 최초 한 번만 세팅 되어 상태 변경해도 반영X => 반응형으로 만들려면 value 써야 함
			onChange={value => {
			  onChange?.(rowData.id, dataKey, value);
			}}
		  />
		) : (
		  text
		)}
	  </Cell>
	);
  };
  
  const ActionCell = ({ rowData, dataKey, onEdit, onRemove, ...props }) => {
	return (
	  <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px' }}>
		<IconButton
		  appearance="subtle"
		  //icon={rowData.status === 'EDIT' ? <VscSave /> : <VscEdit />}
		  onClick={() => {
			onEdit(rowData.id);
		  }}
		/>
		<IconButton
		  appearance="subtle"
		  //icon={<VscRemove />}
		  onClick={() => {
			onRemove(rowData.id);
		  }}
		/>
	  </Cell>
	);
  };


export default sell_insert;