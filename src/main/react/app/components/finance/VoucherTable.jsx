import React, { useState, useEffect } from "react";
import { Container, Image, Message, Table, Popover, Whisper, Checkbox, Dropdown, Button, IconButton, ButtonToolbar, toaster } from 'rsuite';

import "#styles/common.css";

import moreImage from "#images/common/more-info.png";

import AppConfig from "#config/AppConfig.json";


// 나중에 공통으로 빼야함
let formatter = new Intl.NumberFormat(/*'ko-KR', { style: 'currency', currency: 'KRW' }*/);

const { Column, HeaderCell, Cell } = Table;

/**
 * https://rsuitejs.com/components/table/#custom-cell
 */
const Component = ({ opener, dataState, rowState }) => {

	const loadTaskstt = useState(false);
	const [loadTask, setLoadTask] = loadTaskstt;
	const [data, setData] = dataState;
	const [, setVoucher] = rowState;
	let rowLoading = [];

	if (data.length > 0) {

		for (const d of data) {

			d.loadingState = useState(false);
			rowLoading.push(d.loadingState[0]);
//			console.log("d.isLoading", d.isLoading);
		}
	}

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
				{rowData.order_status === "결재중" && !rowData.loadingState[0]
					?
					<Checkbox
						value={rowData[dataKey]}
						inline
						onChange={onChange}
						checked={checkedKeys.some(item => item === rowData[dataKey])}
					/> : null}
			</div>
		</Cell>
	);

	const [checkedKeys, setCheckedKeys] = useState([]);
	const [checkedRows, setCheckedRows] = useState([]);
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
		const rows = checked ? data : [];
		setCheckedKeys(keys);
		setCheckedRows(rows);
	};
	const handleCheck = (value, checked) => {

		const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
		const rows = [];

		for (const k of keys) {

			let stacked = 0;
			for (const d of data) {

				if (k === d.order_id) {
					rows.push(d);
					stacked += 1;
					break;
				}
			}

			if (stacked >= keys.length) break;
		}

		setCheckedKeys(keys);
		setCheckedRows(rows);
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
					voucher_no: item.order_date + '_' + count,
					item_display: displayName,
					items: sameOrderItems,
					assigner: localStorage.getItem('e_name')
				});

				count++;
			});
		});

//		console.log("result :", result);

		return result;
	};

	const showVoucher = (rowData) => {
//		console.log(rowData);

		opener(true);

		const fetchURL = AppConfig.fetch['mytest'];
		fetch(`${fetchURL.protocol}${fetchURL.url}/voucher/get/${rowData.order_id}`, {
			method: "GET",
			mode: "cors",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		})
			.then(res => {

				if (res.ok) {

					const entity = res.json();
					entity.then(res => {

//						console.log("res :", res);
						rowData.v_assigner = res.v_assigner;
						rowData.v_assign_date = res.v_assign_date;
						setVoucher(rowData);
					});
				}
				else {
					opener(false);
					setVoucher({});
					toaster.push(
						<Message showIcon type="error" closable>
							전표처리를 해주세요.
						</Message>,
						{ duration: 3000 }
					);
				}
			});

	};

	const createVoucher = (data) => {

		let currentDate = new Date();
		const localeDate = currentDate.toLocaleDateString (
			"sv-SE",
			{
				timeZone: "Asia/Seoul",
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			}
		);
		if (data instanceof Array) {
//			console.log("배열");
			for (const r of data) {
				r.assign_date = localeDate;
			}
		}
		else {
//			console.log("객체");
			data.assign_date = localeDate;
		}

		const fetchURL = AppConfig.fetch['mytest'];
		fetch(`${fetchURL.protocol}${fetchURL.url}/voucher/signin`, {
			method: "POST",
			mode: "cors",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(res => {

//				const entity = res.json();

				if (res.ok) {

					const entity = res.json();
					entity.then(res => {

//						console.log(1, res);
						const numbered = getNumberedList(res);
						setData(numbered);
					});
				}
				window.location.reload();
				// 로딩끄기
/*				if (data instanceof Array) {
					for (const l in rowLoading) {
						data[l].loadingState[1](false);
					}
				}
				else data.loadingState[1](false);
				setLoadTask(false);
*/			});
	};

	useEffect(() => {

		if (loadTask) {

			for (const l in rowLoading) {
				// 나중에 처리로 들어간것만, 로딩으로 바뀌게 checkedKeys확인
				data[l].loadingState[1](true);
			}
		}

	}, [loadTask, ...rowLoading]);

	return (
		<Container>
			<Table
				virtualized
				bordered
				height={window.innerHeight * 0.6}
				data={data}
				id="table"
			>

				<Column width={50} align="center">
					<HeaderCell style={{ padding: 0 }}>
						<div style={{ lineHeight: '40px' }}>
							{!loadTask ?
								<Checkbox
									inline
									checked={checked}
									indeterminate={indeterminate}
									onChange={handleCheckAll}
								/>
								: null}
						</div>
					</HeaderCell>
					<CheckCell dataKey="order_id" checkedKeys={checkedKeys} onChange={handleCheck} />
				</Column>

				<Column width={140} align="center">
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>전표번호</HeaderCell>
					<Cell>
						{(rowData) => (
							rowData.order_status === "승인" ? <Button
								appearance="link"
								style={{ padding: 0 }}
								onClick={() => showVoucher(rowData)}
							>
								{`${rowData.voucher_no}`}
							</Button>
							: rowData.voucher_no
						)}
					</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={200} align="center">
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
					<Cell>{rowData => rowData.item_display}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={120}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>진행상태</HeaderCell>
					<Cell className="text_center">{rowData => rowData.order_status}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={60}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>승인</HeaderCell>
					<Cell>{(rowData, rowIndex) => (
						rowData.order_status === "결재중" ?
							<Button
								color="green"
								appearance="ghost"
								size="xs"
								loading={rowData.loadingState[0]}
								onClick={() => {

									console.log(rowData);
									setLoadTask(true);
									rowData.loadingState[1](true);
									createVoucher(rowData);
								}}
							>
								처리
							</Button>
							: null
					)}</Cell>
					{/*<ActionCell dataKey="id" />*/}
				</Column>

			</Table>

			<ButtonToolbar className="all_listBtn">
				<Button
					appearance="ghost"
					disabled={checkedKeys.length < 1}
					loading={loadTask}
					onClick={() => {

//						console.log("checkedRows :", checkedRows);

						setLoadTask(true);
						createVoucher(checkedRows);

					}}
				>
					승인
				</Button>
			</ButtonToolbar>
		</Container>
	);
}

export default Component;