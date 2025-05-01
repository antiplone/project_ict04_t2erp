import React, { useState, useEffect } from 'react';
import * as rsuite from 'rsuite';
const { Modal, Button, RadioGroup, Radio, Loader } = rsuite;
import DBChart from '#components/chart/DBChart';
import axios from 'axios';
import { useToast } from '#components/common/ToastProvider';// Import useToast here

const DBChartModal = ({ open, onClose }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState('count');
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const endpoint = selectedFunction === 'count' ? '/api/sales/count' : '/api/sales/items';

      const response = await axios.get(`http://localhost:8000${endpoint}`);
      
      console.log("response => ", response.data);
      
      if (response.data.status === "success") {
        setChartData(response.data.data);
      } else {
        console.error("Server Error:", response.data.message);
        showToast("Server Error: " + response.data.message, 'error');
      }
    } catch (err) {
      console.error("Axios Error:", err);
      if (err.response) {
        console.error("Response Error:", err.response.data);
        showToast("Request failed: " + err.response.data.detail, 'error');
      } else {
        showToast("An unknown error occurred", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData(); // 데이터 fetch
    }
  }, [open, selectedFunction]); // selectedFunction이 변경될 때마다 fetchData 호출

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
          onChange={setSelectedFunction} // selectedFunction 값 변경
        >
          <Radio value="count">날짜별 출고 처리건수</Radio>
          <Radio value="items">품목별 처리건수</Radio>
        </RadioGroup>
        {loading ? <Loader center content="로딩 중..." /> : <DBChart data={chartData} selectedFunction={selectedFunction} />}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DBChartModal;
