import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';

// 원형 차트 색상 배열
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#d885f0'];

function DBChart2({ data }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  if (!data || data.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  // 날짜 필터링
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.shipment_order_date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    return true;
  });
  
  const isOrderCount = filteredData[0]?.hasOwnProperty('order_count');
  const isTotalQuantity = filteredData[0]?.hasOwnProperty('total_quantity');

  const formattedData = filteredData.map(item => ({
    date: new Date(item.shipment_order_date).toLocaleDateString(),
    value: isOrderCount ? item.order_count : item.total_quantity,
  }));

  const totalSum = formattedData.reduce((sum, item) => sum + item.value, 0);

  const pieData = formattedData.map(item => ({
    name: item.date,
    value: item.value,
  }));

  const label = isOrderCount ? '처리건수' : '처리아이템수';

  // 필터링 결과가 없는 경우 처리
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
      <BarChart width={700} height={300} data={formattedData} style={{ margin: '20px auto 5px' }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="delivery_date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name={label} fill="#8884d8" />
      </BarChart>

      {/* 원형 차트 */}
      <h4>{label} 비율 (Pie Chart)</h4>
      <PieChart width={400} height={300} style={{ margin: '0 auto' }}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} "${(percent * 100).toFixed(1)}%"`}
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
    </div>
  );
}

export default DBChart2;