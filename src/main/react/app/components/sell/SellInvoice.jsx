import React, { useRef, useState, useEffect } from 'react';
import { Button } from "rsuite";
import SellInvoiceContent from './SellInvoiceContent';

// print-js를 전역에서 사용할 수 있도록 변수 선언(초기에는 undefined)
let printJS;

const SellInvoice = ({ order_id, order_date, date_no }) => {

  const printRef = useRef(null); // useRef: DOM 요소나 값을 저장하는 데 사용

  // 클라이언트 사이드(window, document, alert() 등) 여부를 판단하기 위한 상태값.
  // 클라이언트 사이드: 내 컴퓨터 브라우저에서 실행되는 부분
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      // 오류 방지를 위해 조건문 사용
      if (typeof window !== 'undefined') {    // 클라이언트에서만 로딩
        import('print-js').then((module) => {  // 일반적으로 import는 코드 시작 부분에서 미리 가져오는데, 동적 import는 필요할 때 비동기적으로(즉, 나중에) 가져오는 방식
          printJS = module.default;
          setIsClient(true);
        });
      }
  }, []);
  
  // 프린트 시에도 css 적용하려면 css 따로 꼭 기재 해줘야 함.
  // printJS는 내부적으로 새 창에 HTML만 옮겨 담고 거기에 style:만 적용해서 프린트하는 구조
  const handlePrint = () => {
    if (printJS && printRef.current) {
      printJS({
        printable: printRef.current.innerHTML,  // 화면에 있는 DOM 요소 안의 HTML 전체 내용을 문자열로 가져옴
        type: 'raw-html',
        style: `
          .invocie_page { zoom: 0.8; }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-family: 'Malgun Gothic', sans-serif;
            margin-bottom: 20px;
          }
          .header-left { width: 30%; }
          .invoice-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
          }
          .company-box {
            border: 2px solid #000;
            padding: 20px;
            font-size: 16px;
            text-align: center;
          }
          .header-right { width: 68%; }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          .info-table th, .info-table td {
            border: 1px solid #000;
            padding: 6px 8px;
            text-align: left;
            vertical-align: middle;
          }
          .info-table .label {
            font-weight: bold;
            text-align: center;
            width: 100px;
          }
          .invoice-table-wrapper {
            width: 100%;
            font-family: 'Malgun Gothic', sans-serif;
            overflow-x: auto;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          .invoice-table th, .invoice-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          .invoice-table thead th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .invoice-table .bold {
            font-weight: bold;
          }
          .invoice-table-bottom {
            width: 100%;
            margin-top: 20px;
            font-family: 'Malgun Gothic', sans-serif;
          }
          .invoice-table-total {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            font-size: 14px;
          }
          .invoice-table-total th, .invoice-table-total td {
            border: 1px solid #000;
            padding: 8px;
          }
          .invoice-table-total th { text-align: left; }
          .invoice-table-total td:nth-child(2),
          .invoice-table-total td:nth-child(4),
          .invoice-table-total td:nth-child(6),
          .invoice-table-total td:nth-child(8),
          .invoice-table-total td:nth-child(10) {
            text-align: right;
          }
        `
      });
    }
  };


  return (
    <>
      <div ref={printRef}>
        <SellInvoiceContent order_id={order_id} order_date={order_date} date_no={date_no} />
        <SellInvoiceContent order_id={order_id} order_date={order_date} date_no={date_no} />
      </div>

          {isClient && <Button color="pink" appearance="ghost" onClick={handlePrint}>프린트</Button>}
    </>
  );
};

export default SellInvoice;