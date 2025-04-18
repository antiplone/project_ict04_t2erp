// 구매팀 - 구매 주문 수정 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/buy.css";
import { Form, Button, Input, Container, Message, InputNumber, Divider } from 'rsuite';

export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매 정보 수정페이지` },
        { name: "description", content: "구매 정보 수정" },
    ];
};

export default function BuyOrderUpdate() {

    const navigate = useNavigate();
    const { order_id } = useParams();
    console.log("order_id", order_id);
    const fetchURL = AppConfig.fetch['mytest'];

    // 주문 정보 및 물품 정보
    const [orderInfo, setOrderInfo] = useState({});
    const [orderItems, setOrderItems] = useState([]);

    // 물품 항목 수정 핸들러
    const updateItem = (index, key, value) => {
        const updated = [...orderItems];
        updated[index][key] = value;
        setOrderItems(updated);
    };

    // const handleChange = (id, key, value) => {
    //     const updated = orderItems.map(order => {
    //         if (order.id === id) {
    //             const newItem = { ...order, [key]: value };
    //             const quantity = Number(newItem.quantity) || 0;
    //             const price = Number(newItem.price) || 0;
    //             const supply = quantity * price;               // 공급가액: 수량 × 단가
    //             const vat = Math.floor(supply * 0.1);          // 부가세: 공급가액의 10% (소수점 버림)
    //             const total = supply + vat;                    // 총액: 공급가액 + 부가세
    //             return { ...newItem, supply, vat, total };
    //         }
    //         return order;
    //     });
    //     setOrderItems(updated);

    // 행 추가
    const handleAddRow = () => {
        const newId = orderItems.length > 0 ? Math.max(...orderItems.map(d => d.id || 0)) + 1 : 1;
        setOrderItems([...orderItems, {
            id: newId,
            item_code: '',
            item_name: '',
            quantity: 0,
            price: 0,
            supply: 0,
            vat: 0,
            total: 0
        }]);
    };

    // 행 삭제
    const handleDeleteRow = (id) => {
        const filtered = orderItems.filter(order => order.id !== id);
        setOrderItems(filtered);
    };

    // 총액 합계 계산
    const totalSum = orderItems.reduce((acc, item) => acc + (item.total || 0), 0);


    // 주문정보 조회
    useEffect(() => {
        if (!order_id) return;

        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderDetail/${order_id}`, {
            method: "GET"
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
                const text = await res.text();
                if (!text) throw new Error("응답 본문이 비어 있음");
                console.log("📦 응답 확인:", text);

                const json = JSON.parse(text);
                console.log("📦 응답 확인:", json);

                if (Array.isArray(json) && json.length > 0) {
                    setOrderInfo(json[0]);               // 주문 정보 설정
                    setOrderItems(json[0].items || []);  // 물품 목록 설정
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
    // CO오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    // 1. 아래 url로 요청시 서버쪽에서 받아주는지 확인
    // 2. 실제로 받았다면 submit이 제대로 되었는지 확인
    // 저장 버튼 클릭 시
    const submitOrder = (e) => {
        e.preventDefault();     // submit이 action을 안타고 자기 할일을 그만한다.
        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderUpdate/${order_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                order: orderInfo,
                items: orderItems
            })
        })
            .then(res => {
                if (!res.ok) throw new Error();
                alert("수정 완료");
                navigate(`/main/buy-select`);
            })
            .catch(() => alert("수정 실패"));
    };
    //[]은 디펜던시인데, setBuyOrderDetail()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    //CO오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    return (
        <>
            <Container style={{ padding: 20 }}>
                <Message type="info"><strong>구매 정보 수정페이지 - 주문번호:{order_id}</strong></Message>

                <br />
                {/* 주문 정보 수정 */}
                <Form fluid formValue={orderInfo} onChange={setOrderInfo} style={{display: "flex", gap: "1rem", marginBottom: 8 }}>
                    <div className="BuyUpdateFrom">
                        <Form.Group>
                            <Form.ControlLabel>발주일자</Form.ControlLabel>
                            <Form.Control name="order_date" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>구매요청 부서</Form.ControlLabel>
                            <Form.Control name="order_type" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>담당자명</Form.ControlLabel>
                            <Form.Control name="e_id" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>거래처명</Form.ControlLabel>
                            <Form.Control name="client_code" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>거래유형</Form.ControlLabel>
                            <Form.Control name="transaction_type" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>입고창고</Form.ControlLabel>
                            <Form.Control name="storage_code" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>진행상태</Form.ControlLabel>
                            <Form.Control name="order_status" />
                        </Form.Group>
                    </div>
                </Form>


                <Message type="info"><strong>물품 정보 수정</strong></Message>

                {/* 물품 정보 수정 */}
                {orderItems.map((item, index) => (
                    <div key={index} style={{ display: "flex", gap: "1rem", marginBottom: 8 }}>
                        <Input
                            value={item.item_code}
                            onChange={val => updateItem(index, 'item_code', val)}
                            style={{ width: 180 }}
                            placeholder="물품코드"
                        />
                        <Input
                            value={item.item_name}
                            onChange={val => updateItem(index, 'item_name', val)}
                            style={{ width: 180 }}
                            placeholder="물품명"
                        />
                        <InputNumber
                            value={item.quantity}
                            onChange={val => updateItem(index, 'quantity', val)}
                            style={{ width: 180 }}
                            placeholder="수량"
                        />
                        <InputNumber
                            value={item.price}
                            onChange={val => updateItem(index, 'price', val)}
                            style={{ width: 180 }}
                            placeholder="단가"
                        />
                        <InputNumber
                            value={item.supply}
                            onChange={val => updateItem(index, 'supply', val)}
                            style={{ width: 180 }}
                            placeholder="공급가액"
                        />
                        <InputNumber
                            value={item.vat}
                            onChange={val => updateItem(index, 'vat', val)}
                            style={{ width: 180 }}
                            placeholder="부가세"
                        />
                        <InputNumber
                            value={item.total}
                            onChange={val => updateItem(index, 'total', val)}
                            style={{ width: 180 }}
                            placeholder="총액"
                        />
                    </div>
                ))}

                <br />
                <Divider />
                <div style={{ fontWeight: 'bold', display: 'flex'}}>총액 합계: {totalSum.toLocaleString()} 원</div>
                <Button appearance="primary" onClick={handleAddRow} style={{width: 80}}>행 추가</Button>
                <Button appearance="primary" onClick={submitOrder} style={{width: 80}}>저장</Button>{' '}
                <Button appearance="subtle" onClick={() => navigate(-1)} style={{width: 80}}>취소</Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1500 }}>
                    
                    {/* handleSubmit은 없으므로 제거하거나 submitOrder 재사용 */}
                    <Button appearance="primary" onClick={submitOrder} style={{ width: 150, marginBottom: 10 }}>입력</Button>
                    
                </div>
            </Container>

        </>
    );
}