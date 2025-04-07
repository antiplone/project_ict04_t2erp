
import React, { useState, useEffect } from "react";
import { Button, ButtonToolbar, Message, DatePicker, Form, 
		 InputGroup, Input, Table, InputPicker,
		 IconButton, InputNumber } from "rsuite";
//import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { mockUsers } from './sell_mock4';
// import SearchIcon from '@rsuite/icons/Search';
import "../components/common/Sell_maintitle.css";
import EmployeeSearchModal from "#components/sell/EmployeeSearchModal";
import StorageSearchModal from "#components/sell/StorageSearchModal";
import ClientSearchModal from "#components/sell/ClientSearchModal";
import ItemSearchModal from "#components/sell/ItemSearchModal";

// const searchBoxstyles = {
// 	width: 200,
// 	marginBottom: 5
//   };

const { Column, HeaderCell, Cell } = Table;

// 빈 테이블로 시작
const defaultData = [];

/* 거래유형 - 선택 데이터 */
const sellType = ["부과세율 적용", "부가세율 미적용"].map(
	(item) => ({ // 이렇게 하면, 둘다 같게 들어가서, 라벨따로 값따로 안넣어줘도 됩니다.
		label: item, // Eugenia
		value: item, // Eugenia
	})
);

const sell_add = (props) => {

	
	// 하위 입력칸을 초기 배열 상태로
	const [sellAdd, setSellAdd] = useState([]);
	//   const [sellAdd, setSellAdd] = useState({
	// 	item_code: '',
	// 	item_name: '',
	// 	item_standard: '',
	// 	quantity: '',
	// 	price: '',
	// 	supply: '',
	// 	vat: '',
	// 	total: '',
	//   });
	

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
	console.log(selectedItem);
	// const [data, setData] = React.useState(defaultData);

	const handleChange = (id, key, value) => {
		const nextData = [...sellAdd];
		const target = nextData.find(item => item.id === id);
		if (target) target[key] = value;
		setSellAdd(nextData);
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

	return (
		<div>
			<Message type="info" bordered showIcon className="main_title">
      			판매입력
    		</Message>
			
			{/* 입력 상위 칸 */}
			<div className="add_final">

				<div className="form_div">
					<div className="add_div">
						<InputGroup className="input">
							<InputGroup.Addon >
							출하지시일
							</InputGroup.Addon>
							<DatePicker />
						</InputGroup>
					</div>

					<div className="add_div">
						<InputGroup className="input">
							<InputGroup.Addon >
								담당자
							</InputGroup.Addon>
							<Input
								placeholder='담당자 입력'
								value={selectedIncharge || ""} readOnly
							/>
							<InputGroup.Button tabIndex={-1} onClick={handleOpenInchargeModal}>
								{/* 모달 열기 버튼 */}
								{/* <SearchIcon onClick={handleOpenInchargeModal} /> */}
							</InputGroup.Button>
						</InputGroup>
						<Input name="customer_1" type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
							value={selectedInchargeName || ""} readOnly />
					</div>

					<div className="add_div">
						<InputGroup className="input">
							<InputGroup.Addon>
								거래처
							</InputGroup.Addon>
							<Input placeholder='거래처'
								value={selectedClient || ""} readOnly
							/>
							<InputGroup.Addon onClick={handleOpenClientModal}>
								{/* <SearchIcon onClick={handleOpenClientModal} /> */}
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
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
								data={sellType}
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
								value={selectedStorage || ""} readOnly
							/>
							<InputGroup.Addon onClick={handleOpenStorageModal}>
								{/* <SearchIcon onClick={handleOpenStorageModal} /> */}
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
							value={selectedStorageName || ""} readOnly />
					</div>
				</div>

					<div className="addPlus">

						<Button style={{ width: 1240 }} 
						onClick={() => {
							setSellAdd([
							{ id: sellAdd.length + 1, item_code: null, item_name: null, 
								item_standard: null, quantity: null, price: null, supply: null, 
								vat: null, total: null, status: 'EDIT' },
							...sellAdd
							]);
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
							value={selectedItem} readOnly
							>
							</EditableCell>
						</Column>

						<Column width={150}>
							<HeaderCell>물품명</HeaderCell>
							<EditableCell
							dataKey="item_name"
							dataType="string"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>규격</HeaderCell>
							<EditableCell
							dataKey="item_standard"
							dataType="string"
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
						<Button appearance="primary" className="sell_Btn">저장</Button>
						<Button type="reset" appearance="primary" className="sell_Btn">다시 작성</Button>
					</ButtonToolbar></div>
					<hr></hr>
				
				<ClientSearchModal
					title="거래처 선택"
					confirm="확인"
					cancel="취소"
					onClientSelect={handleClientSelect}	// client_code, client_name 받기
					handleOpen={isClientModalOpen}
					handleColse={() => setClientModalOpen(false)}
				/>

				<EmployeeSearchModal
					title="담당자 선택"
					confirm="확인"
					cancel="취소"
					onInchargeSelect={handleInchargeSelect}	// e_id, e_name 받기
					handleOpen={isInchargeModalOpen}
					handleColse={() => setInchargeModalOpen(false)}
				/>

				<StorageSearchModal
					title="창고 선택"
					confirm="확인"
					cancel="취소"
					onStorageSelect={handleStorageSelect}	// storage_code, storage_name 받기
					handleOpen={isStorageModalOpen}
					handleColse={() => setStorageModalOpen(false)}
				/>

				<ItemSearchModal
					title="물품 선택"
					confirm="확인"
					cancel="취소"
					onItemSelect={handleItemSelect}
					handleOpen={isItemModalOpen}
					handleColse={() => setItemModalOpen(false)}
				/>
			{/* <hr></hr> */}

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
	  >
		{editing ? (
		  <Field
			defaultValue={value}
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
		  /*icon={rowData.status === 'EDIT' ? <VscSave /> : <VscEdit />}*/
		  onClick={() => {
			onEdit(rowData.id);
		  }}
		/>
		<IconButton
		  appearance="subtle"
		  /*icon={<VscRemove />}*/
		  onClick={() => {
			onRemove(rowData.id);
		  }}
		/>
	  </Cell>
	);
  };


export default sell_add;
