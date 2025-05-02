import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { Container, Text, Table, Message, Checkbox, Button, ButtonToolbar, Steps } from 'rsuite';

import AppConfig from "#config/AppConfig.json";

const { Column, ColumnGroup, HeaderCell, Cell } = Table;

import TabsTable from "#components/common/TabsTable";

import "#components/common/css/common.css";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 회계(FI)` },
		{ name: "description", content: "회계관련 페이지입니다." },
	];
};

// @Remix:모듈함수 - <html>의 <head>의 내용 : 외부 - CSS, Font등.. 링크
export const links = () => [
	// { rel: "stylesheet", href: styles },
];

let data = [
	{'order_id': 1}
];

// 나중에 공통으로 빼야함
let formatter = new Intl.NumberFormat(/*'ko-KR', { style: 'currency', currency: 'KRW' }*/);

// @Remix:url(/main/finance_main) - 회계 메인
export default function FinanceInvoice() {

	const loadTaskstt = useState(false);
	const [loadTask, setLoadTask] = loadTaskstt;
	const [step, setStep] = useState(2);
	let location = useLocation();
	console.log(location.pathname);


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

	return (
		<Container>
			<Message type="info" className="main_title">
				회계-전자계산서
			</Message>
			{/*<TabsTable />*/}
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
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>일자-No.</HeaderCell>
					<Cell>
						{(rowData) => (
							<Button
								appearance="link"
								style={{ padding: 0 }}
								onClick={() => {
									setVoucher(rowData);
									opener(true)
								}}
							>
								{`${rowData.voucher_no}`}
							</Button>
						)}
					</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={140}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>첨부일자</HeaderCell>
					<Cell>{rowData => rowData.t_class}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={180} resizable>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>거래처명</HeaderCell>
					<Cell>{rowData => rowData.client_name}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={160} resizable>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>공급가액</HeaderCell>
					<Cell className="text_right">{rowData => `${formatter.format(rowData.total)}`}</Cell>
				</Column>

				<Column width={160} resizable>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>부가세</HeaderCell>
					<Cell className="text_right">{rowData => `${formatter.format(rowData.total)}`}</Cell>
				</Column>

				<Column width={200}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>합계금액</HeaderCell>
					<Cell className="text_right">{rowData => `${formatter.format(rowData.total)}`}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={80}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>종류</HeaderCell>
					<Cell>{rowData => rowData.t_class}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={250}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>전자(세금)계산서 진행단계</HeaderCell>
					<Cell>
						<Steps small current={step}>
							{step === 0 ? <Steps.Item status="error" title="미첨부" /> : <Steps.Item />}
							{step === 1 ? <Steps.Item title="처리중" /> : <Steps.Item /> }
							{step === 2 ? <Steps.Item stepNumber="완" /> : <Steps.Item /> }
						</Steps>
					</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={160}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>단계별기능</HeaderCell>
					<Cell>{rowData => rowData.t_class}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={160}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>승인번호</HeaderCell>
					<Cell>{rowData => rowData.t_class}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={120}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>내역보기</HeaderCell>
					<Cell>{rowData => rowData.t_class}</Cell>
					{/*<NameCell dataKey="name" />*/}
				</Column>

				<Column width={60}>
					<HeaderCell style={{ fontSize: "medium", fontWeight: "bold" }}>인쇄</HeaderCell>
					<Cell>{rowData => rowData.t_class}</Cell>
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

					}}
				>
					승인
				</Button>
			</ButtonToolbar>
		</Container>
	);
}
