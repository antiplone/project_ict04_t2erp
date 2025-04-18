import React, { useState } from "react";
import { Table, Popover, Whisper, Checkbox, Dropdown, IconButton, Progress } from 'rsuite';

let data = [
	{
		id: false,
		avatar: null,
		name: "Heyo",
		progress: 10,
		rating: 4,
		amount: "8888"
	}
];

// 나중에 공통으로 빼야함
let formatter = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' });

const { Column, HeaderCell, Cell } = Table;

/*const ImageCell = ({ rowData, dataKey, ...props }) => (
	<Cell {...props} style={{ padding: 0 }}>
		<div
			style={{
				width: 40,
				height: 40,
				background: '#f5f5f5',
				borderRadius: 6,
				marginTop: 2,
				overflow: 'hidden',
				display: 'inline-block'
			}}
		>
			<img src={rowData.avatar} width="40" />
		</div>
	</Cell>
);
*/

/*const renderMenu = ({ onClose, left, top, className }, ref) => {
	const handleSelect = eventKey => {
		onClose();
		console.log(eventKey);
	};
	return (
		<Popover ref={ref} className={className} style={{ left, top }} full>
			<Dropdown.Menu onSelect={handleSelect}>
				<Dropdown.Item eventKey={1}>Follow</Dropdown.Item>
				<Dropdown.Item eventKey={2}>Sponsor</Dropdown.Item>
				<Dropdown.Item eventKey={3}>Add to friends</Dropdown.Item>
				<Dropdown.Item eventKey={4}>View Profile</Dropdown.Item>
				<Dropdown.Item eventKey={5}>Block</Dropdown.Item>
			</Dropdown.Menu>
		</Popover>
	);
};

const ActionCell = ({ rowData, dataKey, ...props }) => {
	return (
		<Cell {...props} className="link-group">
			<Whisper placement="autoVerticalStart" trigger="click" speaker={renderMenu}>
				<IconButton appearance="subtle" icon={<MoreIcon />} />
			</Whisper>
		</Cell>
	);
};
*/

const Component = () => {

	const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
		<Cell {...props} style={{ padding: 0 }}>
			<div style={{ lineHeight: '46px' }}>
				<Checkbox
					value={rowData[dataKey]}
					inline
					onChange={onChange}
					checked={checkedKeys.some(item => item === rowData[dataKey])}
				/>
			</div>
		</Cell>
	);

	/**
	 * 
	 */
	const NameCell = ({ rowData, dataKey, ...props }) => {
		const speaker = (
			<Popover title="Description">
				<p>
					<b>Name:</b> {rowData.name}
				</p>
				<p>
					<b>Gender:</b> {rowData.gender}
				</p>
				<p>
					<b>City:</b> {rowData.city}
				</p>
				<p>
					<b>Street:</b> {rowData.street}
				</p>
			</Popover>
		);

		return (
			<Cell {...props}>
				<Whisper placement="top" speaker={speaker}>
					<a>{rowData[dataKey]}</a>
				</Whisper>
			</Cell>
		);
	};

	const [ checkedKeys, setCheckedKeys ] = useState([]);
	let checked = false;
	let indeterminate = false;

	if (checkedKeys.length === data.length) {
		checked = true;
	} else if (checkedKeys.length === 0) {
		checked = false;
	} else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
		indeterminate = true;
	}

	const handleCheckAll = (value, checked) => {
		const keys = checked ? data.map(item => item.id) : [];
		setCheckedKeys(keys);
	};
	const handleCheck = (value, checked) => {
		const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
		setCheckedKeys(keys);
	};

	return (
		<Table height={300} data={data} id="table">
			<Column width={50} align="center" resizable>
				<HeaderCell style={{ padding: 0 }}>
					<div style={{ lineHeight: '40px' }}>
						<Checkbox
							inline
							checked={checked}
							indeterminate={indeterminate}
							onChange={handleCheckAll}
						/>
					</div>
				</HeaderCell>
				<CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
			</Column>
			{/*			<Column width={80} align="center" resizable>
				<HeaderCell>Avartar</HeaderCell>
				<ImageCell dataKey="avartar" />
			</Column>
*/}
			<Column width={120} resizable>
				<HeaderCell>전표번호</HeaderCell>
				<NameCell dataKey="name" />
			</Column>

			<Column width={160} resizable>
				<HeaderCell>거래유형</HeaderCell>
				<NameCell dataKey="name" />
			</Column>

			<Column width={120} resizable>
				<HeaderCell>금액</HeaderCell>
				<Cell>{rowData => `${formatter.format(rowData.amount)}`}</Cell>
			</Column>

			<Column width={160} resizable>
				<HeaderCell>거래처명</HeaderCell>
				<NameCell dataKey="name" />
			</Column>

			<Column width={160} resizable>
				<HeaderCell>적요</HeaderCell>
				<NameCell dataKey="name" />
			</Column>

			{/*			<Column width={230} resizable>
				<HeaderCell>Skill Proficiency</HeaderCell>
				<Cell style={{ padding: '10px 0' }}>
					{rowData => <Progress percent={rowData.progress} showInfo={false} />}
				</Cell>
			</Column>
*/}
			{/*			<Column width={100} resizable>
				<HeaderCell>Rating</HeaderCell>
				<Cell>
					{rowData =>
						Array.from({ length: rowData.rating }).map((_, i) => <span key={i}>⭐️</span>)
					}
				</Cell>
			</Column>
*/}

{/*			<Column width={120} resizable>
				<HeaderCell>
					<MoreIcon />
				</HeaderCell>
				<ActionCell dataKey="id" />
			</Column>
*/}		</Table>
	);
}

export default Component;