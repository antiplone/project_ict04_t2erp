// 구매팀 - 구매 주문 수정 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import * as rs from 'rsuite';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/buy.css";

export default function BuyOrderUpdate() {

    const navigate = useNavigate();

    const { order_id } = useParams();

    const fecthURL = AppConfig.fetch['mytest'];

    // 주문 정보 및 물품 정보
    const [orderInfo, setOrderInfo] = useState({});
    const [orderItems, setOrderItems] = useState([]);

    // fecth()를 통해 톰캣서버에세 데이터를 요청
    useEffect(() => {
        if (!order_id) return;

        fetch(`${fecthURL.protocol}${fecthURL.url}/buy/buyOrderDetail/${order_id}`)
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json) && json.length > 0) {
                    setOrderInfo(json[0]);
                    setOrderItems(json[0].items || []);
                }
            })
            .catch(err => {
                console.error("데이터 불러오기 오류:", err);
                alert("데이터를 불러오지 못했습니다.");
            });
    }, [order_id]);
    // []은 디펜던시인데, setBuyOrderDetail()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    // CORS 오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    // 물품 항목 수정 핸들러
    const updateItem = (index, key, value) => {
        const updated = [...orderItems];
        updated[index][key] = value;
        setOrderItems(updated);
    };

    // 저장 버튼 클릭 시
    const handleSave = () => {
        fetch(`${fecthURL.protocol}${fecthURL.url}/buy/updateOrderWithItems/${order_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderInfo,
                orderItems
            })
        })
            .then(res => {
                if (!res.ok) throw new Error("수정 실패");
                alert("수정이 완료되었습니다.");
                navigate(`/main/buy-order-detail/${order_id}`);
            })
            .catch(err => {
                console.error("수정 오류:", err);
                alert("저장 중 문제가 발생했습니다.");
            });
    };

    return (
        <>
            <rs.Container style={{ padding: 20 }}>
                <rs.Message type="info"><strong>구매 정보 수정</strong></rs.Message>

                <br />
                {/* 주문 정보 수정 */}
                <rs.Form fluid formValue={orderInfo} onChange={setOrderInfo}>
                    <rs.FormGroup>
                        <rs.ControlLabel>거래유형</rs.ControlLabel>
                        <rs.FormControl name="transaction_type" />
                    </rs.FormGroup>
                    <rs.FormGroup>
                        <rs.ControlLabel>입고창고</rs.ControlLabel>
                        <rs.FormControl name="storage_name" />
                    </rs.FormGroup>
                    <rs.FormGroup>
                        <rs.ControlLabel>진행상태</rs.ControlLabel>
                        <rs.FormControl name="order_status" />
                    </rs.FormGroup>
                </rs.Form>

                <rs.Message type="info"><strong>물품 정보 수정</strong></rs.Message>

                {/* 물품 정보 수정 */}
                {orderItems.map((item, index) => (
                    <div key={index} style={{ display: "flex", gap: "1rem", marginBottom: 8 }}>
                        <rs.Input
                            value={item.item_code}
                            onChange={val => updateItem(index, 'item_code', val)}
                            style={{ width: 180 }}
                            placeholder="물품명"
                        />
                        <rs.Input
                            value={item.item_name}
                            onChange={val => updateItem(index, 'item_name', val)}
                            style={{ width: 180 }}
                            placeholder="물품명"
                        />
                        <rs.InputNumber
                            value={item.quantity}
                            onChange={val => updateItem(index, 'quantity', val)}
                            style={{ width: 100 }}
                            placeholder="수량"
                        />
                        <rs.InputNumber
                            value={item.price}
                            onChange={val => updateItem(index, 'price', val)}
                            style={{ width: 100 }}
                            placeholder="단가"
                        />
                        <rs.InputNumber
                            value={item.supply}
                            onChange={val => updateItem(index, 'supply', val)}
                            style={{ width: 100 }}
                            placeholder="공급가액"
                        />
                        <rs.InputNumber
                            value={item.vat}
                            onChange={val => updateItem(index, 'vat', val)}
                            style={{ width: 100 }}
                            placeholder="부가세"
                        />
                        <rs.InputNumber
                            value={item.total}
                            onChange={val => updateItem(index, 'total', val)}
                            style={{ width: 100 }}
                            placeholder="총액"
                        />
                    </div>
                ))}

                <br />
                <rs.Divider />

                <rs.Button appearance="primary" onClick={handleSave}>저장</rs.Button>{' '}
                <rs.Button appearance="subtle" onClick={() => navigate(-1)}>취소</rs.Button>
            </rs.Container>

        </>
    );
};
