import React, { useState, useEffect } from "react";
import { Image, Table, Popover, Whisper, Checkbox, Dropdown, IconButton } from 'rsuite';

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
const Component = () => {

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
		const keys = checked ? data.map(item => item.id) : [];
		setCheckedKeys(keys);
	};
	const handleCheck = (value, checked) => {
		const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
		setCheckedKeys(keys);
	};

	const getNumberedList = (data) => {
		let result = [];
		let groupedByDate = {};

		// 날짜별로 그룹핑
		data.forEach(item => {
			if (!groupedByDate[item.order_date]) {
				groupedByDate[item.order_date] = [];
			}
			groupedByDate[item.order_date].push(item);
		});

		// 날짜별로 처리
		Object.keys(groupedByDate).forEach(date => {
			// groupedByDate : 날짜별로 데이터를 묶어둔 객체
			// ex: { '2025-04-10': [item1, item2, ...], '2025-04-11': [item3, ...] }
			let orders = groupedByDate[date];	// 해당 날짜(date)의 전체 주문 데이터 배열
			let seenOrderIds = new Set();	// 중복된 주문(order_id)을 한 번만 처리하기 위해 사용
			let count = 1;

			orders.forEach(item => {
				if (seenOrderIds.has(item.order_id)) return;	 // 이미 처리한 주문번호(order_id)는 무시
				seenOrderIds.add(item.order_id);

				// 같은 order_id의 품목 모으기
				const sameOrderItems = orders.filter(x => x.order_id === item.order_id);
				// 주문번호와 item 주문번호가 같은 걸 배열로 만들기
				const firstItemName = sameOrderItems[0].item_name;
				const displayName = sameOrderItems.length > 1
					? `${firstItemName} 외 ${sameOrderItems.length - 1}건`
					: firstItemName;

				// 한 줄만 push
				result.push({
					...item,
					date_no: count,
					item_display: displayName
				});

				count++;
			});
		});

		return result;
	};

	const [allList, setAllList] = useState([]);
	const fetchURL = AppConfig.fetch['mytest'];
	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allList`, {
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
		<Table width={window.innerWidth * 0.72} height={window.innerHeight * 0.75} data={allList/*data*/} id="table">

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
				<CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
			</Column>

			<Column width={140} sortable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>전표번호</HeaderCell>
				<Cell>
					{(rowData) => (
						<span
							onClick={() => allListDetail(rowData.order_id)}
							// style={{ cursor: 'pointer' }}
							className="allList-date"
						>
							{`${rowData.order_date}_${rowData.date_no}`}
						</span>
					)}
				</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={200}>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>거래유형</HeaderCell>
				<Cell>{rowData => rowData.order_type === 1 ? "매출전표" : "매입전표"}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={160} resizable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>금액</HeaderCell>
				<Cell>{rowData => `${formatter.format(rowData.total_sum)}`}</Cell>
			</Column>

			<Column width={180} resizable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>거래처명</HeaderCell>
				<Cell>{rowData => rowData.client_name}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={560} resizable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>적요</HeaderCell>
				<Cell>{rowData => rowData.item_standard}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={120} resizable>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>진행상태</HeaderCell>
				<Cell>{rowData => rowData.order_status}</Cell>
				{/*<NameCell dataKey="name" />*/}
			</Column>

			<Column width={40}>
				<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>-</HeaderCell>
				<ActionCell dataKey="id" />
			</Column>

		</Table>
	);
}

export default Component;