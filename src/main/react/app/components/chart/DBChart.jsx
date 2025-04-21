import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function DBChart() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/predict");
      console.log("response => ", response.data);
      if (response.data.status === "success") {
        const parsedData = response.data.data.map(item => ({
          date: item.shipment_order_date.slice(0, 10),
          quantity: item.quantity,
        }));
        setData(parsedData);

      } else {
        console.error("Server Error:", response.data.message);
      }
    } catch (err) {
      console.error("Axios Error:", err);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 fetchData() 실행
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {data.length > 0 && (
        <LineChart
          width={700}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
        </LineChart>
      )}
    </div>
  );
}

export default DBChart;
