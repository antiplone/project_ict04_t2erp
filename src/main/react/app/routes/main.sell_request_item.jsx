
import React, { useState } from "react";
import { Button, ButtonToolbar, Message, DatePicker, Form, 
		 InputGroup, AutoComplete, HStack, Input, Table, 
		 IconButton, InputNumber, SelectPicker, VStack } from "rsuite";
import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { mockUsers } from './sell_mock4';
// import SearchIcon from '@rsuite/icons/Search';
import "../components/common/Sell_maintitle.css";
import EmployeeSearchModal from "#components/sell/EmployeeSearchModal";
import StorageSearchModal from "#components/sell/StorageSearchModal";
import ClientSearchModal from "#components/sell/ClientSearchModal";

const styles = {
	width: 150,
	marginBottom: 5
  };

const { Column, HeaderCell, Cell } = Table;
const defaultData = mockUsers(8);


// const t_styles = `
//   .table-cell-editing .rs-table-cell-content {
// 	padding: 4px;
//   }
//   .table-cell-editing .rs-input {
// 	width: 100%;
//   }
//   `;

/* 거래유형 - 선택 데이터 */
const sellType = ["부과세율 적용", "부가세율 미적용"].map(
	(item) => ({ // 이렇게 하면, 둘다 같게 들어가서, 라벨따로 값따로 안넣어줘도 됩니다.
		label: item, // Eugenia
		value: item, // Eugenia
	})
);

const SellRequestItem = () => {

	const [data, setData] = React.useState(defaultData);

	const handleChange = (id, key, value) => {
		const nextData = Object.assign([], data);
		nextData.find(item => item.id === id)[key] = value;
		setData(nextData);
	};
	const handleEdit = id => {
		const nextData = Object.assign([], data);
		const activeItem = nextData.find(item => item.id === id);

		activeItem.status = activeItem.status ? null : 'EDIT';

		setData(nextData);
	};

	const handleRemove = id => {
		setData(data.filter(item => item.id !== id));
	};


	return (
		<div>
			
			<Message type="info" bordered showIcon className="main_title">
      			물품 구매 요청
    		</Message>
			
			{/* 입력 상위 칸 */}
			
			<div className="final">
			
				<Form className="addForm" layout="inline">

				
					<div className="addPlus">
					{/* <style>{t_styles}</style> */}
					
						<Button style={{ width: 830 }} 
						onClick={() => {
							setData([
							{ id: data.length + 1, name: '', age: 0, birthdate: null, status: 'EDIT' },
							...data
							]);
						}}
						>
						입력 추가하기
						</Button></div>
						<hr />

						{/* 입력 하위 칸 */}
						<div className="addTabel">
						<Table height={400} data={data}>

						<Column width={150}>
							<HeaderCell>품목코드</HeaderCell>
							<EditableCell
							//dataKey="name"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>품목명</HeaderCell>
							<EditableCell
							//dataKey="age"
							dataType="string"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>규격</HeaderCell>
							<EditableCell
							//dataKey="birthdate"
							dataType="string"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={100}>
							<HeaderCell>수량</HeaderCell>
							<EditableCell
							//dataKey="birthdate"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>단가</HeaderCell>
							<EditableCell
							//dataKey="birthdate"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>공급가액</HeaderCell>
							<EditableCell
							//dataKey="birthdate"
							dataType="number"
							onChange={handleChange}
							onEdit={handleEdit}
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>부가세</HeaderCell>
							<EditableCell
							//dataKey="birthdate"
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
					
					<ButtonToolbar >
						<div className="itemAddBtn">
						<Button appearance="primary" className="itemAddBtn_">저장</Button>
						<Button type="reset" appearance="primary" className="itemAddBtn_">다시 작성</Button>
						</div>
					</ButtonToolbar>
					<hr></hr>

				</Form>
			</div>
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
		  onEdit?.(rowData.id);
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
		  icon={rowData.status === 'EDIT' ? <VscSave /> : <VscEdit />}
		  onClick={() => {
			onEdit(rowData.id);
		  }}
		/>
		<IconButton
		  appearance="subtle"
		  icon={<VscRemove />}
		  onClick={() => {
			onRemove(rowData.id);
		  }}
		/>
	  </Cell>
	);
  };

export default SellRequestItem;
