import React, { useState, useEffect } from "react";
import { Image, Table, Popover, Whisper, Checkbox, Dropdown, Button, IconButton } from 'rsuite';

import "#styles/common.css";

import moreImage from "#images/common/more-info.png";

import AppConfig from "#config/AppConfig.json";


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
let formatter = new Intl.NumberFormat(/*'ko-KR', { style: 'currency', currency: 'KRW' }*/);

const { Column, HeaderCell, Cell } = Table;

/**
 * https://rsuitejs.com/components/table/#custom-cell
 */
const Component = ({ opener, data }) => {

	const renderMenu = ({ onClose, left, top, className }, ref) => {
		const handleSelect = eventKey => {
			onClose();
			console.log(eventKey);

			switch (eventKey) {
				case 1:
					console.log("상세화면 표시");
					break;

				case 2:
					const fetchURL = AppConfig.fetch['mytest'];
					fetch(`${fetchURL.protocol}${fetchURL.url}/voucher/signin/1`, {
						method: "POST"
					})
						.then(res => res.json())
						.then(res => {
							console.log(res);
						});

					console.log("승인 처리");
					break;
			}
		};

		return (
			<Popover ref={ref} className={className} style={{ left, top }} full>
				<Dropdown.Menu onSelect={handleSelect}>
					<Dropdown.Item eventKey={1}>확인</Dropdown.Item>
					<Dropdown.Item eventKey={2}>승인</Dropdown.Item>
				</Dropdown.Menu>
			</Popover>
		);
	};

	const ActionCell = ({ rowData, dataKey, ...props }) => {
		return (
			<Cell {...props} className="link-group">
				<Whisper placement="autoVerticalStart" trigger="click" speaker={renderMenu}>
					<IconButton style={{ padding: 0 }} appearance="subtle" icon={<Image width={20} height={20} src={moreImage} />} />
				</Whisper>
			</Cell>
		);
	};

	const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
		<Cell {...props} style={{ padding: 0 }}>
			<div style={{ lineHeight: '46px' }}>
				{rowData.order_status === "결재중" ? <Checkbox
					value={rowData[dataKey]}
					inline
					onChange={onChange}
					checked={checkedKeys.some(item => item === rowData[dataKey])}
				/> : null}
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

	const [checkedKeys, setCheckedKeys] = useState([]);
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
		const keys = checked ? data.map(item => item.order_id) : [];
		setCheckedKeys(keys);
	};
	const handleCheck = (value, checked) => {
		const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
		setCheckedKeys(keys);
	};


	return (
		<Table
			virtualized
			bordered
			height={window.innerHeight * 0.75}
			data={data}
			id="table"
		>

			<Column width={50} align="center">
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
				<CheckCell dataKey="order_id" checkedKeys={checkedKeys} onChange={handleCheck} />
			</Column>

			<Column width={140}>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>전표번호</HeaderCell>
				<Cell>
					{(rowData) => (
						<Button
							appearance="link"
							style={{padding: 0}}
							onClick={() => opener(true)}
						>
							{`${rowData.order_date}_${rowData.date_no}`}
						</Button>
					)}
				</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={200}>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>거래유형</HeaderCell>
				<Cell>{rowData => rowData.t_class}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={180} resizable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>거래처명</HeaderCell>
				<Cell>{rowData => rowData.client_name}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={160} resizable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>금액</HeaderCell>
				<Cell className="text_right">{rowData => `${formatter.format(rowData.total)}`}</Cell>
			</Column>

			<Column width={560} resizable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>적요</HeaderCell>
				<Cell>{rowData => rowData.item_standard}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={120}>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>진행상태</HeaderCell>
				<Cell className="text_center">{rowData => rowData.order_status}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={60}>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>승인</HeaderCell>
				<Cell>{( rowData ) => (
					rowData.order_status === "결재중" ?
						<Button
							color="green"
							appearance="ghost"
							size="xs"
							onClick={() => {
								rowData.ordet_status = "승인";
							}}>
							처리
						</Button>
					: null
				)}</Cell>
				{/*<ActionCell dataKey="id" />*/}
			</Column>

		</Table>
	);
}

export default Component;