import React, { useRef, useState, useEffect } from 'react';
import { Button } from "rsuite";

import VoucherPrint from "#components/finance/VoucherPrint";

import AppConfig from "#config/AppConfig.json";

// print-js를 전역에서 사용할 수 있도록 변수 선언(초기에는 undefined)
let printJS;


// react-to-print : 리액트 프린트하는 라이브러리이나, CommonJS 방식으로 배포된 라이브러리로
// type: "module" 환경 (즉, ESM 전용 환경)이라 사용 불가(Remix는 SSR까지 겹치니까 window, document, ref 관련 에러도 터짐)
// 즉, react-to-print는 기본적으로 Vite + ESM + SSR 조합에 잘 안 맞는 구조

// print-js + SSR-safe dynamic import 으로 프린트 기능 진행
const SellSlipAll = ({ rowState }) => {

	// 인쇄할 DOM 요소에 접근하기 위해 useRef 사용
	const printRef = useRef();
	const [rowData, setRowData] = rowState;

	// 클라이언트 사이드 여부를 판단하기 위한 상태값
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {

		// 오류 방지를 위해 조건문 사용
		if (typeof window !== 'undefined') {
			import('print-js').then((module) => {
				printJS = module.default;
				setIsClient(true);
			});
		}

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
						rowData.voucher_no = res.v_number;
						rowData.v_assigner = res.v_assigner;
						rowData.v_assign_date = res.v_assign_date;
						setRowData(rowData);
					});
				}
				else {
					opener(false);
					setRowData({});
					toaster.push(
						<Message showIcon type="error" closable>
							전표처리를 해주세요.
						</Message>,
						{ duration: 3000 }
					);
				}
			});
	}, [rowData]);

	const handlePrint = () => {
		if (printJS && printRef.current) {
			printJS({
				printable: printRef.current.innerHTML,
				type: 'raw-html',
				style: `.journal-container {
				  width: 100%;
				  margin: 0 auto;
				  font-family: 'Malgun Gothic', sans-serif;
				}
				
				.journal-title {
				  text-align: center;
				  margin: 30px 0 10px 0;
				  font-size: 2em;
				  font-weight: bold;
				}
				
				.journal-header {
				  margin-bottom: 10px;
				  font-size: 1em;
				}
				
				.journal-header .journal-writer {
				  float: right;
				}
				
				.journal-table {
				  width: 100%;
				  border-collapse: collapse;
				  margin-bottom: 10px;
				}
				
				.journal-table th,
				.journal-table td {
				  border: 1px solid #888;
				  padding: 6px 4px;
				}
				
				.journal-table th {
				  background: #f8f8f8;
				}
				
				.journal-table .journal-sum {
				  background: #f8f8f8;
				  font-weight: bold;
				}
				
				.journal-table td {
				  vertical-align: top;
				}
				
				.journal-table .journal-right {
				  text-align: right;
				}
				
				.journal-footer {
				  text-align: right;
				  font-size: 13px;
				  color: #555;
				}
				
				.journal-page {
				  font-size: 12px;
				  color: #888;
				  margin-top: 6px;
				}
        		`
			});
		}
	};

	return (
		<div>

			<VoucherPrint printRef={printRef} rowState={rowState} />

			{isClient && <Button color="pink" appearance="ghost" onClick={handlePrint}>프린트</Button>}
		</div>
	);
};

export default SellSlipAll;