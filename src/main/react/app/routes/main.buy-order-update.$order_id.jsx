// 구매팀 - 구매 주문 수정 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/buy.css";
import { Form, Button, Container, Message, Divider, InputGroup, Input, InputPicker } from 'rsuite';
import ashBn from "#images/common/ashBn.png";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";

export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매 정보 수정페이지` },
        { name: "description", content: "구매 정보 수정" },
    ];
};

export default function BuyOrderUpdate() {

    const navigate = useNavigate();
    const { order_id } = useParams();
    const fetchURL = AppConfig.fetch['mytest'];

    // 주문 정보 및 물품 정보
    const [orderInfo, setOrderInfo] = useState({});
    const [orderItems, setOrderItems] = useState([]);

    // 거래처 모달관리
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [isClientModalOpen, setClientModalOpen] = useState(false);

    // 담당자 모달관리
    const [selectedIncharge, setSelectedIncharge] = useState(null);
    const [selectedInchargeName, setSelectedInchargeName] = useState(null);
    const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);

    // 입고 창고 모달 관리
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageName, setSelectedStorageName] = useState(null);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);

    // 물품 항목 수정 핸들러
    const updateItem = (index, newData) => {
        setOrderItems(prev => {
            const updated = [...prev];
            const current = { ...updated[index], ...newData };

            // 수량과 단가가 모두 있는 경우 자동 계산
            const quantity = Number(current.quantity) || 0;
            const price = Number(current.price) || 0;
            const supply = quantity * price;
            const vat = supply * 0.1;
            const total = supply + vat;

            updated[index] = {
                ...current,
                supply,
                vat,
                total,
            };

            return updated;
        });
    };

    // 행 추가
    const handleAddRow = () => {
        const maxId = orderItems.length > 0 ? Math.max(...orderItems.map(d => d.id ?? 0)) : 0;
        const newItem = {
            id: maxId + 1,
            order_id: orderInfo.order_id, // 누락시 물품정보 추가해도 db에 해당 order_id의 물품정보가 안들어간다.
            item_code: '',
            item_name: '',
            quantity: 0,
            price: 0,
            supply: 0,
            vat: 0,
            total: 0
        };
        setOrderItems(prev => [...prev, newItem]);
    };


    // 행 삭제
    const handleDeleteRow = (id) => {
        setOrderItems(orderItems.filter(item => item.id !== id));
    };

    // 총액 합계 계산
    const totalSum = orderItems.reduce((acc, item) => acc + (item.total || 0), 0);


    // 주문정보 조회
    useEffect(() => {
        if (!order_id) return;

        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderDetail/${order_id}`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json) && json.length > 0) {
                    const data = json[0]; // 추가 하지 않으면 모달에 값들이 안들어온다.
                    setOrderInfo(json[0]);
                    setOrderItems(json[0].items || []);

                    // 모달창 선택용 값 저장 (표시용)
                    setSelectedClient(data.client_code || null);
                    setSelectedClientName(data.client_name || "");
                    setSelectedIncharge(data.e_id || null);
                    setSelectedInchargeName(data.e_name || "");
                    setSelectedStorage(data.storage_code || null);
                    setSelectedStorageName(data.storage_name || "");
                }
            })
            .catch(err => {
                console.error("데이터 가져오기 오류:", err);
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

        const itemsWithOrderId = orderItems.map(item => ({
            ...item,
            order_id: orderInfo.order_id || order_id  // fallback
        }));

        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderUpdate/${order_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                order: orderInfo,
                items: itemsWithOrderId,
                status: { order_status: orderInfo.order_status },
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
                <Message type="info"><strong>구매 정보 수정페이지 - 발주번호:{order_id}</strong></Message>

                <br />
                {/* 주문 정보 수정 */}
                <Form fluid formValue={orderInfo} onChange={setOrderInfo} style={{ display: "flex", gap: "1rem", marginBottom: 8 }}>
                    <div className="BuyUpdateFrom">
                        <Form.Group>
                            <Form.ControlLabel>발주일자</Form.ControlLabel>
                            <Form.Control name="order_date" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>구매요청 부서</Form.ControlLabel>
                            <Form.Control name="order_type" />
                        </Form.Group>

                        <InputGroup className="input">
                            <InputGroup.Addon style={{ width: 80 }}>담당자</InputGroup.Addon>
                            <Input value={selectedIncharge || ""} readOnly />
                            <InputGroup.Button tabIndex={-1}>
                                <img
                                    src={readingGlasses}
                                    alt="돋보기"
                                    width={20}
                                    height={20}
                                    onClick={() => setInchargeModalOpen(true)}
                                    style={{ cursor: "pointer" }}
                                />
                            </InputGroup.Button>
                        </InputGroup>
                        <Input value={selectedInchargeName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />

                        <InputGroup className="input">
                            <InputGroup.Addon style={{ width: 80 }}>거래처</InputGroup.Addon>
                            <Input value={selectedClient || ""} readOnly />
                            <InputGroup.Addon>
                                <img
                                    src={readingGlasses}
                                    alt="돋보기"
                                    width={20}
                                    height={20}
                                    onClick={() => setClientModalOpen(true)}
                                    style={{ cursor: "pointer" }}
                                />
                            </InputGroup.Addon>
                        </InputGroup>
                        <Input value={selectedClientName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />

                        <Form.Group>
                            <Form.ControlLabel>거래유형</Form.ControlLabel>
                            <Form.Control name="transaction_type" />
                        </Form.Group>

                        <InputGroup className="input">
                            <InputGroup.Addon style={{ width: 80 }}>입고창고</InputGroup.Addon>
                            <Input value={selectedStorage || ""} readOnly />
                            <InputGroup.Addon>
                                <img
                                    src={readingGlasses}
                                    alt="돋보기"
                                    width={20}
                                    height={20}
                                    onClick={() => setStorageModalOpen(true)}
                                    style={{ cursor: "pointer" }}
                                />
                            </InputGroup.Addon>
                        </InputGroup>
                        <Input value={selectedStorageName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />

                        <Form.Group>
                            <Form.ControlLabel>납기일자</Form.ControlLabel>
                            <Form.Control name="delivery_date" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>진행상태</Form.ControlLabel>
                            <Form.Control
                                name="order_status"
                                accepter={InputPicker}
                                data={[{ label: '미확인', value: '미확인' }, { label: '진행중', value: '진행중' }, { label: '승인', value: '승인' }, { label: '반려', value: '반려' }]}
                            />
                        </Form.Group>
                    </div>
                </Form>
                <Divider />
                {/* <Message type="info"><strong>물품 정보 수정</strong></Message> */}

                {/* 물품 정보 수정 */}
                {orderItems.map((item, index) => (
                    <Form
                        key={item.id} // 여기 꼭 고유한 id
                        fluid
                        formValue={item}
                        onChange={val => updateItem(index, val)}
                    >
                        <div className="BuyUpdateFrom">
                            <Form.Group>
                                <Form.ControlLabel>물품코드</Form.ControlLabel>
                                <Form.Control name="item_code" placeholder="물품코드" />
                            </Form.Group>

                            {/* <Form.Group>
                                <Form.ControlLabel>물품명</Form.ControlLabel>
                                <Form.Control name="item_name" placeholder="물품명" />
                            </Form.Group> */}

                            <Form.Group>
                                <Form.ControlLabel>수량</Form.ControlLabel>
                                <Form.Control name="quantity" type="number" placeholder="수량" />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel>단가</Form.ControlLabel>
                                <Form.Control name="price" type="number" placeholder="단가" />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel>공급가액</Form.ControlLabel>
                                <Form.Control name="supply" type="number" placeholder="공급가액" />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel>부가세</Form.ControlLabel>
                                <Form.Control name="vat" type="number" placeholder="부가세" />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel>총액</Form.ControlLabel>
                                <Form.Control name="total" type="number" placeholder="총액" />
                            </Form.Group>

                            <Button color="red" size="xs">
                                <img
                                    src={ashBn}
                                    alt="돋보기"
                                    width={20}
                                    height={20}
                                    onClick={() => handleDeleteRow(item.id)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Button>
                        </div>
                    </Form>
                ))}

                {/* 거래처 모달 관리 */}
                <ClientSearchModal
                    handleOpen={isClientModalOpen}
                    handleColse={() => setClientModalOpen(false)}
                    onClientSelect={(code, name) => {
                        setSelectedClient(code);
                        setSelectedClientName(name);
                        setOrderInfo(prev => ({ ...prev, client_code: code }));  // ← 추가
                    }}
                />

                {/* 담당자 모달 관리 */}
                <InchargeSearchModal
                    handleOpen={isInchargeModalOpen}
                    handleColse={() => setInchargeModalOpen(false)}
                    onInchargeSelect={(id, name) => {
                        setSelectedIncharge(id);
                        setSelectedInchargeName(name);
                        setOrderInfo(prev => ({ ...prev, e_id: id }));  // ← 추가
                    }}
                />

                {/* 입고창고 모달관리 */}
                <StorageSearchModal
                    handleOpen={isStorageModalOpen}
                    handleColse={() => setStorageModalOpen(false)}
                    onStorageSelect={(code, name) => {
                        setSelectedStorage(code);
                        setSelectedStorageName(name);
                        setOrderInfo(prev => ({ ...prev, storage_code: code }));  // ← 추가
                    }}
                />

                <Divider />
                <div style={{ fontWeight: 'bold', marginBottom: 10 }}>
                    총액 합계: {totalSum.toLocaleString()} 원
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <Button appearance="primary" onClick={handleAddRow}>행 추가</Button>
                    <Button appearance="primary" onClick={submitOrder}>저장</Button>
                    <Button appearance="subtle" onClick={() => navigate(-1)}>취소</Button> {/* navigate(-1); 브라우저 history 뒤로 */}
                </div>
            </Container>

        </>
    );
}