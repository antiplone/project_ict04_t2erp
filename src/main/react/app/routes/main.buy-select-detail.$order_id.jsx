// 구매팀 - 구매상세 조회 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import * as rs from 'rsuite';
import Table from 'rsuite/Table';
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export function meta() {
  return [
    { title: `${AppConfig.meta.title} : 구매내역 상세조회` },
    { name: "description", content: "구매현황조회" },
  ];
};

const { Column, HeaderCell, Cell } = Table;

export default function BuySelectDetail() {

  const { order_id } = useParams();

  // 주문정보 (단일 객체)
  const [orderInfo, setOrderInfo] = useState({});

  // 물품정보 (배열)
  const [orderItems, setOrderItems] = useState([]);

  const fetchURL = AppConfig.fetch['mytest']

  // fecth()를 통해 톰캣서버에세 데이터를 요청
  useEffect(() => {
    if (!order_id) return;

    fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderDetail/${order_id}`, {
      method: "GET"
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
        const text = await res.text();
        if (!text) throw new Error("응답 본문이 비어 있음");

        const json = JSON.parse(text);
        console.log("📦 응답 확인:", json);

        if (Array.isArray(json) && json.length > 0) {
          setOrderInfo(json[0]); // 주문 정보

          // item 정보만 따로 추출
          const items = json.map(order => ({
            item_code: order.item_code,
            item_name: order.item_name,
            quantity: order.quantity,
            price: order.price,
            supply: order.supply,
            vat: order.vat,
            total: order.total
          }));
          setOrderItems(json[0].items); // 물품 목록
        } else {
          setOrderInfo({});
          setOrderItems([]);
        }
      })
      .catch(error => {
        console.error("데이터 가져오기 오류:", error);
        setOrderInfo({});
        setOrderItems([]);
      });
  }, [order_id]);
  // []은 디펜던시인데, setBuyOrderDetail()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
  // CORS 오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

  // 삭제
  const deleteOrderItem = (order_id) => {
    console.log("삭제할 주문 ID:", order_id); // 디버깅용 로그

    fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrder/` + order_id, {
      method: 'DELETE',
    })
      .then((res) => res.text())
      .then((res) => {
        if (res === "ok") {
          alert('삭제 성공!');
          setBuyOrderAllList(buyOrderAllList.filter(order => order.order_id !== order_id)); // UI 업데이트
        } else {
          alert('삭제 실패');
        }
      })
      .catch(error => console.error("삭제 오류:", error));
  }

  return (
    <>
      <rs.Container>

        <rs.Message type="info" style={{ width: 1500 }}>
          <strong>구매 상세페이지</strong>
        </rs.Message>
        <br />
        <>
          <Table height={100} width={1500} data={[orderInfo]} onRowClick={OrderData => console.log(OrderData)}>
            <Column width={120}><HeaderCell>발주번호</HeaderCell><Cell dataKey="order_id" /></Column>
            <Column width={120}><HeaderCell>발주일자</HeaderCell><Cell dataKey="order_date" /></Column>
            <Column width={120}><HeaderCell>구매요청 부서</HeaderCell><Cell dataKey="order_type" /></Column>
            <Column width={120}><HeaderCell>담당자명</HeaderCell><Cell dataKey="e_name" /></Column>
            <Column width={120}><HeaderCell>거래처명</HeaderCell><Cell dataKey="client_name" /></Column>
            <Column width={120}><HeaderCell>거래유형</HeaderCell><Cell dataKey="transaction_type" /></Column>
            <Column width={120}><HeaderCell>입고창고</HeaderCell><Cell dataKey="storage_name" /></Column>
            <Column width={120}><HeaderCell>진행상태</HeaderCell><Cell dataKey="order_status" /></Column>
            {/* <Column width={120}><HeaderCell>회계처리 여부</HeaderCell><Cell dataKey="" /></Column> */}
          </Table>
        </>

        <>
          <Table height={400} width={1500} data={orderItems} onRowClick={itemData => console.log(itemData)}>
            <Column width={120}><HeaderCell>물품코드</HeaderCell><Cell dataKey="item_code" /></Column>
            <Column width={120}><HeaderCell>물품명</HeaderCell><Cell dataKey="item_name" /></Column>
            <Column width={120}><HeaderCell>수량</HeaderCell><Cell dataKey="quantity" /></Column>
            <Column width={120}><HeaderCell>단가</HeaderCell><Cell dataKey="price" /></Column>
            <Column width={120}><HeaderCell>공급가액</HeaderCell><Cell dataKey="supply" /></Column>
            <Column width={120}><HeaderCell>부가세</HeaderCell><Cell dataKey="vat" /></Column>
            <Column width={120}><HeaderCell>총액</HeaderCell><Cell dataKey="total" /></Column>
          </Table>
        </>

      </rs.Container>

      <div style={{ display: 'flex' }}>
        <Link to={`/main/buy-order-update/${order_id}`}>
          <rs.Button appearance="primary" style={{ width: 100 }}>
            수정
          </rs.Button>
        </Link>

        <rs.Button appearance="primary" style={{ width: 100 }} onClick={() => deleteOrderItem(orderInfo.order_id)}>
          삭제
        </rs.Button>

        <Link to={`/main/buy-select`}>
          <rs.Button appearance="primary" style={{ width: 100 }}>
            목록
          </rs.Button>
        </Link>
      </div>

    </>
  );
};
