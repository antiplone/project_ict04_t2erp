import React, { useState, useEffect } from 'react';
import {
	BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
	PieChart, Pie, Cell, LabelList
} from 'recharts';

// 원형 차트 색상 배열
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#d885f0', '#b885f0'];

function DBChart2({ data, selectedFunction, onSearch }) {
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	// 컴포넌트 내부
	useEffect(() => {
		if (startDate && endDate) {
			onSearch(startDate, endDate);
		}
	}, [startDate, endDate]);
	
	useEffect(() => {
		console.log('받은 데이터:', data); 
		if (!startDate && !endDate && data.length > 0) {
			const dates = data.map(d => new Date(d.delivery_date));
			const minDate = new Date(Math.min(...dates));
			const maxDate = new Date(Math.max(...dates));
			setStartDate(minDate.toISOString().slice(0, 10));
			setEndDate(maxDate.toISOString().slice(0, 10));
		}
	}, [data]);

	if (!data || data.length === 0) {
		return <div>조회된 데이터가 없습니다.</div>;
	}

	// 날짜 필터링
	const filteredData = data.filter(item => {
  		const itemDate = new Date(item.delivery_date);
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;
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
		name: isOrderCount ? item.date : `${item.item_name} (${item.date})`,
		value: item.value,
	}));

	const label = isOrderCount ? '일자별 입고 처리건수' : '아이템별 입고 처리건수';

	if (filteredData.length === 0) {
		return (
			<div>
				{/* 기간 선택 UI */}
				<div style={{ marginBottom: '20px' }}>
					<label>
						시작 날짜:
						<input
							type="date"
							value={startDate}
							onChange={e => setStartDate(e.target.value)}
						/>
					</label>
					<label style={{ marginLeft: '20px' }}>
						종료 날짜:
						<input
							type="date"
							value={endDate}
							onChange={e => setEndDate(e.target.value)}
						/>
					</label>
					<button
						style={{ marginLeft: '20px' }}
						onClick={() => onSearch(startDate, endDate)}
					>
						검색
					</button>
				</div>
				<div>선택한 기간에 데이터가 없습니다.</div>
			</div>
		);
	}

	return (
		<div>
			{/* 기간 선택 UI */}
			<div style={{ marginBottom: '20px' }}>
				<label>
					시작 날짜:
					<input
						type="date"
						value={startDate}
						onChange={e => setStartDate(e.target.value)}
					/>
				</label>
				<label style={{ marginLeft: '20px' }}>
					종료 날짜:
					<input
						type="date"
						value={endDate}
						onChange={e => setEndDate(e.target.value)}
					/>
				</label>
			</div>

			{/* 막대 차트 */}
			<h4>{label} 차트</h4>
			
			{/* 원형 차트 */}
			<h4>{label} 비율 (Pie Chart)</h4>
			<PieChart width={600} height={selectedFunction === 'count' ? 300 : 400} style={{ margin: '0 auto' }}>
				<Pie
					data={pieData}
					cx="50%"
					cy="50%"
					labelLine={false}
					label={({ name, value, percent }) => `${name} ${value}건, "${(percent * 100).toFixed(1)}%"`}
					outerRadius={80}
					fill="#8884d8"
					dataKey="value"
				>
					{pieData.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
			
			<BarChart width={700} height={selectedFunction === 'count' ? 400 : 600 } data={formattedData} style={{ margin: '20px auto 5px' }}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey={selectedFunction === 'count' ? "date" : "item_name"}
					tick={selectedFunction === 'count' ? { angle: 0, textAnchor: 'middle' } : false}
				/>
				<YAxis />
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
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						</React.Fragment>
					))}
				</Bar>
			</BarChart>
		</div>
	);
}

export default DBChart2;
