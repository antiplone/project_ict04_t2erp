import { useState, useEffect } from "react";
import { useLocation } from "@remix-run/react";
import { Container, Button, Message, Modal, Placeholder, Loader } from "rsuite";

import VoucherTable from "#components/finance/VoucherTable"
import VoucherPrint from "#components/finance/VoucherPrint"

import AppConfig from "#config/AppConfig.json"

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


// @Remix:url(/main/finance_main) - 회계 전표관리
export default function FinanceVoucher() {

	let location = useLocation();
//	console.log(location.pathname);

	const dataState = useState([]);
	const [allList, setAllList] = dataState;
	const [open, setOpen] = useState(false);
	const rowState = useState({});
	const [rowData] = rowState;

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
					items: sameOrderItems
				});

				count++;
			});
		});

//		console.log("result :", result);

		return result;
	};

	useEffect(() => {

		if (allList.length < 1) {

			const fetchURL = AppConfig.fetch['mytest'];
			fetch(`${fetchURL.protocol}${fetchURL.url}/voucher/transactions`, {
				method: "GET"
			})
				.then(res => {
	
					const entity = res.json();
	
					if (res.ok) {
	
						entity.then(res => {
	
//							console.log(1, res);
							const numbered = getNumberedList(res);
							setAllList(numbered);
						});
					}
				});
		}
		else {
			
		}
	}, [ allList ]);

	return (
		<Container>
			<Message type="success" className="main_title">
				회계-전표관리
			</Message>
			{/*<Outlet />*/}

			{allList.length < 1 ?
				<Container>
					<Placeholder.Paragraph rows={16} />
					<Loader center content="불러오는중..." />
				</Container>
			: <VoucherTable opener={setOpen} dataState={dataState} rowState={rowState} />}

			<Modal open={open} onClose={() => setOpen(false)}
				style={{
					position: 'fixed',
					left: '30%',
					width: 800
				}}>
				<Modal.Header>
					<Modal.Title>전표</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<VoucherPrint target={rowData} />
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={() => setOpen(false)} appearance="default">닫기</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}
