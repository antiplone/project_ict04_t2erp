import { useState, useEffect } from "react";
import { Container, Placeholder, Loader } from "rsuite";

import "#styles/voucher.css";


// 나중에 공통으로 빼야함
let formatter = new Intl.NumberFormat(/*'ko-KR', { style: 'currency', currency: 'KRW' }*/);


const Component = ({ printRef, rowState }) => {

	const [rowData, setRowData] = rowState;
	let [accTotal, setAccTotal] = useState(rowData.total_sum !== undefined ? rowData.total_sum : 0);

	const VoucherLoader = () => {
		return (
			<Container>
				<Placeholder.Paragraph rows={14} />
				<Loader center content="불러오는중..." />
			</Container>
		);
	};

	const VoucherForm = () => {

		return (
			<div className="journal-container" ref={printRef}>
				<h2 className="journal-title">전표</h2>
				<div className="journal-header">
					<span>고객사: {rowData.client_name}</span>
					<span className="journal-writer">작성자: {rowData.v_assigner}</span>
				</div>
				<div className="journal-header">
					<span>전표번호 : {rowData.voucher_no}</span>
				</div>
				<table className="journal-table">
					<thead>
						<tr>
							<th style={{ backgroundColor: '#ebebeb', width: 120 }}>계정명</th>
							<th style={{ backgroundColor: '#ebebeb' }}>적요</th>
							<th style={{ backgroundColor: '#ebebeb', width: 120 }}>차변</th>
							<th style={{ backgroundColor: '#ebebeb', width: 120 }}>대변</th>
						</tr>
					</thead>
					<tbody>
						{rowData.items.length > 1 ? rowData.items.map((row, idx) => (
							<tr key={idx}>
								<td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.t_type}</td>
								<td style={{ verticalAlign: 'middle' }}>
									{row.item_name + ' : ' + row.item_standard}
									{/*row.적요.map((line, i) => (
									<div key={i}>{line}</div>
								))*/}
								</td>
								<td style={{ verticalAlign: 'middle' }} className="journal-right">{row.order_type === 2 ? formatter.format(row.total) : null}</td>
								<td style={{ verticalAlign: 'middle' }} className="journal-right">{row.order_type === 1 ? formatter.format(row.total) : null}</td>
							</tr>
						)) :
							<tr>
								<td>{rowData.t_type}</td>
								<td>
									{rowData.item_name + ' : ' + rowData.item_standard}
									{/*row.적요.map((line, i) => (
									<div key={i}>{line}</div>
								))*/}
								</td>
								<td className="journal-right">{rowData.order_type === 2 ? formatter.format(rowData.total) : null}</td>
								<td className="journal-right">{rowData.order_type === 1 ? formatter.format(rowData.total) : null}</td>
							</tr>
						}
						<tr>
							<td style={{ backgroundColor: '#ebebeb' }} className="journal-sum" colSpan={2}>합계</td>
							<td className="journal-sum journal-right">{rowData.order_type === 2 ? formatter.format(accTotal) : null}</td>
							<td className="journal-sum journal-right">{rowData.order_type === 1 ? formatter.format(accTotal) : null}</td>
						</tr>
					</tbody>
				</table>
				<div style={{ fontWeight: 'bold' }} className="journal-footer">
					{rowData.v_assign_date} <span style={{ color: '#9a0000' }}>승인</span>
				</div>
				{/*<div className="journal-page">[ 1 / 1 ]</div>*/}
			</div>
		);
	}

	useEffect(() => {

		if (rowData.voucher_no !== undefined) {

			rowData.items.forEach(value => { accTotal += value.total });
			accTotal = rowData.items.length > 1 ? accTotal : rowData.total;
			setAccTotal(accTotal);

			console.log("accTotal :", accTotal);

//			console.log(rowData);
		}


	}, [rowData]);

	return (
		rowData.voucher_no !== undefined ? <VoucherForm accTotal={accTotal} /> : <VoucherLoader />
	);
}

export default Component;