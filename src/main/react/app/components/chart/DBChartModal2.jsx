import React, { useState, useEffect } from 'react';
import * as rsuite from 'rsuite';
const { Modal, Button, RadioGroup, Radio, Loader } = rsuite;
import DBChart2 from '#components/chart/DBChart2';
import axios from 'axios';
import { useToast } from '#components/common/ToastProvider';// Import useToast here

const DBChartModal2 = ({ open, onClose }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState('count');
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (startDate, endDate) => {
    const endpoint = selectedFunction === 'count' ? '/api/order/count' : '/api/order/items';
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000${endpoint}`,{
		  params: {
			  start_date: startDate,
			  end_date: endDate,
		  },
	  });
      console.log("response => ", response.data);
      if (response.data.status === "success") {
        setChartData(response.data.data);
      } else {
        console.error("Server Error:", response.data.message);
        setError("Server Error: " + response.data.message);
        showToast("Server Error: " + response.data.message, 'error');
      }
    } catch (err) {
      console.error("Axios Error:", err);
      if (err.response) {
        console.error("Response Error:", err.response.data);
        setError("Request failed: " + err.response.data.detail);
        showToast("Request failed: " + err.response.data.detail, 'error');
      } else {
        setError("An unknown error occurred");
        showToast("An unknown error occurred", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, selectedFunction]);

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title className='text_center'>차트 보기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RadioGroup
          inline
          name="chartFunction"
          value={selectedFunction}
          onChange={setSelectedFunction}
        >
          <Radio value="count">날짜별 입고 처리건수</Radio>
          <Radio value="items">품목별 처리건수</Radio>
        </RadioGroup>
		{loading 
			? 
			<Loader center content="로딩 중..." /> 
			: 
			<DBChart2
				data={chartData}
				selectedFunction={selectedFunction}
				onSearch={(startDate, endDate) => fetchData(startDate, endDate)}
			/>
		}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DBChartModal2;
