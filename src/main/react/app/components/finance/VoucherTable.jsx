import React, { useState, useEffect } from "react";
import { Container, Image, Table, Popover, Whisper, Checkbox, Dropdown, Button, IconButton, ButtonToolbar } from 'rsuite';

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
	const [data] = dataState;
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

	const showVoucher = (rowData) => {
		console.log(rowData);

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

						console.log("res :", res);
						rowData.v_assigner = res.v_assigner;
						setVoucher(rowData);
					});
				}
				else {
					alert("전표 처리를 해주세요.");
				}
			});

	};

	const createVoucher = (data) => {

		if (data instanceof Array) {
			console.log("배열");

		}
		else {
			console.log("객체");

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

//					const entity = res.json();

				if (res.ok) {
					console.log("예예예옝");
/*						entity.then(res => {

							console.log(1, res);
							const numbered = getNumberedList(res);
							setAllList(numbered);
						});
*/					}
			});
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

				<Column width={140}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>전표번호</HeaderCell>
					<Cell>
						{(rowData) => (
							<Button
								appearance="link"
								style={{ padding: 0 }}
								onClick={() => showVoucher(rowData)}
							>
								{`${rowData.voucher_no}`}
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