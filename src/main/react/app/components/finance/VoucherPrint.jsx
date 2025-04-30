import "#styles/voucher.css";

const data = [
  {
    계정명: "장기차입금",
    적요: [
      "신한은행36913014004/서울시설공단/미지급 급여 대체",
      "서울시설공단 한기관 사원의 미지급 급여 + 이자 명목"
    ],
    차변: "332,561,400",
    대변: ""
  },
  {
    계정명: "가지급금",
    적요: [
      "한기관(서울시설공단)/서울시설공단/미지급 급여 대체",
      "서울시설공단 한기관 사원의 미지급 급여 + 이자 명목"
    ],
    차변: "",
    대변: "332,561,400"
  }
];

// 나중에 공통으로 빼야함
let formatter = new Intl.NumberFormat(/*'ko-KR', { style: 'currency', currency: 'KRW' }*/);


const Component = ({ printRef }) => {

	return (
		<div className="journal-container" ref={printRef}>
			<h2 className="journal-title">전표</h2>
			<div className="journal-header">
				<span>회사명: (주)가장많이쓰는ERP/서울시설공단/미지급 급여 대체</span>
				<span className="journal-writer">작성자: guest</span>
			</div>
			<div className="journal-header">
				<span>전표번호 : 2025/04/28-17</span>
			</div>
			<table className="journal-table">
				<thead>
					<tr>
						<th style={{ width: 120 }}>계정명</th>
						<th>적요</th>
						<th style={{ width: 120 }}>차변</th>
						<th style={{ width: 120 }}>대변</th>
					</tr>
				</thead>
				<tbody>
					{data.map((row, idx) => (
						<tr key={idx}>
							<td>{row.계정명}</td>
							<td>
								{row.적요.map((line, i) => (
									<div key={i}>{line}</div>
								))}
							</td>
							<td className="journal-right">{row.차변}</td>
							<td className="journal-right">{row.대변}</td>
						</tr>
					))}
					<tr>
						<td className="journal-sum" colSpan={2}>합계</td>
						<td className="journal-sum journal-right">332,561,400</td>
						<td className="journal-sum journal-right">332,561,400</td>
					</tr>
				</tbody>
			</table>
			<div className="journal-footer">
				2025/04/28 오후 3:57:46
			</div>
			{/*<div className="journal-page">[ 1 / 1 ]</div>*/}
		</div>
	);
}

export default Component;