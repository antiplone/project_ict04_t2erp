import React, { useState } from 'react';
import {
	BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
	PieChart, Pie, Cell, LabelList
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#d885f0', '#b885f0'];

function DBChart2({ data, selectedFunction, onSearch }) {
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [searchStartDate, setSearchStartDate] = useState('');
	const [searchEndDate, setSearchEndDate] = useState('');
	const [showSearch, setShowSearch] = useState(false);

	if (!data || data.length === 0) {
		return <div>조회된 데이터가 없습니다.</div>;
	}

	// 날짜 필터링
	const filteredData = data.filter(item => {
		const itemDate = new Date(item.delivery_date);
		const start = searchStartDate ? new Date(searchStartDate) : null;
		const end = searchEndDate ? new Date(searchEndDate) : null;
		if (start && itemDate < start) return false;
		if (end && itemDate > end) return false;
		return true;
	});

	const isOrderCount = filteredData[0]?.hasOwnProperty('order_count');

	const formattedData = filteredData.map(item => ({
		date: new Date(item.delivery_date).toLocaleDateString(),
		value: isOrderCount ? item.order_count : item.total_quantity,
		item_name: item.item_name,
	}));

	const pieData = formattedData.map(item => ({
		name: isOrderCount ? item.date : item.item_name,
		value: item.value,
	}));

	const label = isOrderCount ? '일자별 입고 처리건수' : '아이템별 입고 처리건수';

	return (
		<div>
			{/* 날짜 필터 */}
			<div style={{ marginBottom: '20px' }}>
				<label>
					시작 날짜:
					<input
						type="date"
						value={startDate}
						onChange={e => {
							setStartDate(e.target.value);
							setShowSearch(true);
						}}
					/>
				</label>
				<label style={{ marginLeft: '20px' }}>
					종료 날짜:
					<input
						type="date"
						value={endDate}
						onChange={e => {
							setEndDate(e.target.value);
							setShowSearch(true);
						}}
					/>
				</label>
				{showSearch && (
					<button
						style={{ marginLeft: '20px' }}
						onClick={() => {
							setSearchStartDate(startDate);
							setSearchEndDate(endDate);
							setShowSearch(false);
							console.log("검색 클릭됨:", startDate, endDate);
							onSearch(startDate, endDate);
						}}
					>
						검색
					</button>
				)}
			</div>

			{/* 필터 후 결과가 없을 경우 */}
			{searchStartDate && searchEndDate && filteredData.length === 0 && (
				<div>선택한 기간에 데이터가 없습니다.</div>
			)}

			{/* 차트 렌더링 */}
			{filteredData.length > 0 && (
				<>
					{/* 원형 차트 */}
					<h4 style={{ textAlign: 'center' }}>{label} 비율 (Pie Chart)</h4>
					<PieChart width={600} height={selectedFunction === 'count' ? 300 : 400} style={{ margin: '0 auto' }}>
						<Pie
							data={pieData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({ name, value, percent }) => `${name}, ${value}건, ${(percent * 100).toFixed(1)}%`}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							{pieData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>

					{/* 막대 차트 */}
					<h4 style={{ textAlign: 'center' }}>{label} 차트</h4>
					<BarChart
						width={700}
						height={selectedFunction === 'count' ? 300 : 400}
						data={formattedData}
						style={{ margin: '20px auto 5px' }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey={selectedFunction === 'count' ? "date" : "item_name"}
							tick={selectedFunction === 'count' ? { angle: 0, textAnchor: 'middle' } : false}
						/>
						<YAxis domain={[0, 'dataMax + 1']} allowDecimals={false} />
						<Tooltip />
						<Legend />
						<Bar dataKey="value" name={label}>
							{formattedData.map((entry, index) => (
								<React.Fragment key={index}>
									<LabelList
										dataKey="item_name"
										position="inside"
										style={{
											fill: 'black',
											fontSize: 12,
											fontWeight: '100',
											textAnchor: 'middle'
										}}
									/>
									<Cell fill={COLORS[index % COLORS.length]} />
								</React.Fragment>
							))}
						</Bar>
					</BarChart>
				</>
			)}
		</div>
	);
}

export default DBChart2;
