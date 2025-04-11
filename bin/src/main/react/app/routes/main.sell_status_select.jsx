
import React from "react";
import { Button, ButtonToolbar, Message, DatePicker, Form, 
		 InputGroup, AutoComplete, HStack, Input, Table, InputPicker,
		 IconButton, InputNumber, DateRangePicker} from "rsuite";
//import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { mockUsers } from './sell_mock4';
import SearchIcon from '@rsuite/icons/Search';
import "../components/common/Sell_maintitle.css";

const styles = {
	width: 150,
	marginBottom: 5
  };

const { Column, HeaderCell, Cell } = Table;
const defaultData = mockUsers(8);

const sell_status_select = () => {

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
			
			<Message type="success" className="main_title">
				판매 현황
			</Message>
			
			{/* 입력 상위 칸 */}
			
			<div className="result_final">
			
				<Form className="addForm" layout="inline">

				<div className="form_div">
					<div className="result_div">
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>
								등록일자
							</InputGroup.Addon>
							<DateRangePicker />
						</InputGroup>
					</div>

					<div className="result_div">
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>
								담당자
							</InputGroup.Addon>
							<Input
								placeholder='담당자 입력'
								// value={selectedIncharge ? selectedIncharge.em_name : ""}
							/>
							<InputGroup.Addon>
								{/* <SearchIcon /> */}
							</InputGroup.Addon>
						</InputGroup>
					</div>

					<div className="result_div">
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>
								거래처
							</InputGroup.Addon>
							<Input placeholder='거래처' />
							<InputGroup.Addon>
								{/* <SearchIcon /> */}
							</InputGroup.Addon>
						</InputGroup>
					</div>
				</div>

				<div className="form_div">
					<div className="result_div">
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>
								거래유형
							</InputGroup.Addon>
							<InputPicker placeholder='거래유형 선택' 
							// data={type} 
							style={{ width: 224, border: 'none' }} />
						</InputGroup>
					</div>

					<div className="result_div">
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>
								출하창고
							</InputGroup.Addon>
							<Input placeholder='입고창고' />
						</InputGroup>
					</div>

					<div className="result_div">
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>
								품목코드
							</InputGroup.Addon>
							<Input placeholder='품목코드' />
						</InputGroup>
					</div>
				</div>

					<div className="form_div">
					
						<Button appearance="primary" type="submit" style={{width: 100}}>
							검색
						</Button></div>
						<hr />


						{/* 입력 하위 칸 */}
						<div className="addTabel">
						<Table height={400} data={data}>

						<Column width={150}>
							<HeaderCell>일자-No.</HeaderCell>
							<Cell
							//dataKey="date"
							dataType="date"
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>품목명</HeaderCell>
							<Cell
							//dataKey="age"
							dataType="string"
							/>
						</Column>

						<Column width={100}>
							<HeaderCell>수량</HeaderCell>
							<Cell
							//dataKey="birthdate"
							dataType="number"
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>단가</HeaderCell>
							<Cell
							//dataKey="birthdate"
							dataType="number"
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>공급가액</HeaderCell>
							<Cell
							//dataKey="birthdate"
							dataType="number"
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>부가세</HeaderCell>
							<Cell
							//dataKey="birthdate"
							dataType="number"
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>합계</HeaderCell>
							<Cell
							//dataKey="birthdate"
							dataType="number"
							/>
						</Column>

						<Column width={150}>
							<HeaderCell>거래처명</HeaderCell>
							<Cell
							//dataKey="birthdate"
							dataType="String"
							/>
						</Column>

					</Table>
					</div>

					<div className="resultBtn">
					<ButtonToolbar >
						<Button appearance="primary" className="result_btn">인쇄</Button>
					</ButtonToolbar>
					</div>
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

export default sell_status_select;