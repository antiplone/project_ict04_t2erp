// 구매팀 - 구매입력 페이지
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import React, { useState } from "react";
import { Button, Container, DatePicker, Divider, Input, InputGroup, InputNumber, InputPicker, Message, Table, IconButton } from "rsuite";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import { useNavigate } from "@remix-run/react";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import "../styles/buy.css";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";
import ashBn from "#images/common/ashBn.png";

export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매입력` },
        { name: "description", content: "구매입력" },
    ];
};

const { Column, HeaderCell, Cell } = Table;

/* 거래유형 - 선택 데이터 */
const buyType = ["부과세율 적용", "부가세율 미적용"].map(
    (item) => ({ label: item, value: item })
);

// RSuite Table => 편집 셀, 셀 하나를 렌더링하고, 데이터 수정할 수 있도록 input 필드 표시 (문자입력)
const EditableCell = ({ rowData, dataKey, onChange, editable, ...props }) => (
    <Cell {...props}>
        {editable ? ( // editable ? 셀편집이 가능한지 여부, editable === true 편집가능 모드, editable === false 읽기 전용 모드 
            <Input
                size="xs"
                value={rowData[dataKey] || ''}
                onChange={(value) => onChange(rowData.id, dataKey, value)} // 사용자가 입력한 값 onchange를 통해 부모 컨포넌트로 전달
            />
        ) : (
            rowData[dataKey]
        )}
    </Cell>
);

// RSuite Table => 테이블 내에서 숫자를 수정할 수 있게 해준다. (숫자 전용 입력)
const EditableNumberCell = ({ rowData, dataKey, onChange, editable, ...props }) => (  // rowData  행 데이터, 물품정보 한건에 해당하는 정보
    <Cell {...props}>
        {editable ? (
            <InputNumber
                size="xs"
                value={rowData[dataKey] || 0}
                onChange={(value) => onChange(rowData.id, dataKey, value)}
            />
        ) : (
            rowData[dataKey]
        )}
    </Cell>
);

export default function BuyInsert() {

    const navigate = useNavigate();

    // 물품 입력 목록 저장
    const [orderItems, setOrderItems] = useState([
        { order_id: 1, item_code: '', quantity: 0, price: 0, supply: 0, vat: 0, total: 0 },
    ]);

    // 납기일자
    const [deliveryDate, setDeliveryDate] = useState(null);

    // 거래유형
    const [selectedType, setSelectedType] = useState('');

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

    // 입력값 변경시 자동 계산
    const handleChange = (id, key, value) => {
        const updated = orderItems.map(order => {
            if (order.id === id) {
                const newItem = { ...order, [key]: value };
                const quantity = Number(newItem.quantity) || 0;
                const price = Number(newItem.price) || 0;
                const supply = quantity * price;               // 공급가액: 수량 × 단가
                const vat = Math.floor(supply * 0.1);          // 부가세: 공급가액의 10% (소수점 버림)
                const total = supply + vat;                    // 총액: 공급가액 + 부가세
                return { ...newItem, supply, vat, total };
            }
            return order;
        });
        setOrderItems(updated);   // 수정된 배열로 상태 업데이트
    };

    // 행 추가 
    const handleAddRow = () => {
        const newItem = orderItems.length > 0
            ? Math.max(...orderItems.map(d => d.id)) + 1  // 현재 입력된 모든 행의 id 값만 추출 ex) [{id:1}, {id:2}, {id:5}] → [1, 2, 5] / 현재 존재하는 id 중 가장 큰 값을 찾아서 +1을 한다.
            : 1;
        setOrderItems([
            ...orderItems, // 기존 물품정보에
            {
                id: newItem,  // 새 물품정보들을 맨 뒤에 추가한다.
                item_code: '',
                quantity: 0,
                price: 0,
                supply: 0,
                vat: 0,
                total: 0
            }
        ]);
    };

    // 행 삭제
    const handleDeleteRow = (id) => {
        const filtered = orderItems.filter(order => order.id !== id);
        setOrderItems(filtered);// 필터링된 배열로 orderItems 상태를 업데이트한다.
    };

    // 총합계액을 계산
    const totalSum = orderItems.reduce((acc, order) => acc + (order.total || 0), 0); // reduce 누적 계산을 하는 고차함수, acc 누적값(total 값을 누적해서 저장)

    const fetchURL = AppConfig.fetch["mytest"];

    const handleSubmit = async () => {
        if (!selectedClient || !selectedIncharge || !selectedStorage || !selectedType) { // 거래처, 담당자, 입고창고, 거래유형 중 하나라도 선택하지 않으면 입력하라는 알림이 뜬다.
            alert("주문 정보를 모두 입력해주세요.");
            return;
        }
        if (orderItems.length === 0) {
            alert("물품을 1개 이상 입력해주세요.");
            return;
        }

        try {
            const requestBody = {
                order: {
                    delivery_date: deliveryDate.toLocaleDateString('sv-SE'), // 브라우저 기준 날짜
                    client_code: selectedClient,
                    e_id: selectedIncharge,
                    storage_code: selectedStorage,
                    transaction_type: selectedType,
                    order_type: 2, // 2는 구매팀 주문입력건
                },
                items: orderItems.map(({ id, ...item }) => item)
            };

            const response = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyInsertAll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                alert("주문 저장에 실패했습니다.");
                return;
            }

            alert("주문이 정상 등록되었습니다.");
            navigate("/main/buy-select");
        } catch (err) {
            console.error(err);
            alert("오류 발생");
        }
    };

    return (
        <Container >
            <Message type="info" style={{ maxWidth: 1500 }}>
                <strong>구매입력</strong>
            </Message>
            <br />

            <div className="inputBox">
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>납기일자</InputGroup.Addon>
                    <DatePicker value={deliveryDate} onChange={setDeliveryDate} />
                </InputGroup>

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
            </div>

            <div className="inputBox">
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>거래유형</InputGroup.Addon>
                    <InputPicker
                        placeholder="거래유형 선택"
                        data={buyType}
                        style={{ width: 224 }}
                        value={selectedType}
                        onChange={setSelectedType}
                    />
                </InputGroup>

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

            </div>

            {/* 거래처 모달 관리 */}
            <ClientSearchModal
                handleOpen={isClientModalOpen}
                handleColse={() => setClientModalOpen(false)}
                onClientSelect={(code, name) => {
                    setSelectedClient(code);
                    setSelectedClientName(name);
                }}
            />

            {/* 담당자 모달 관리 */}
            <InchargeSearchModal
                handleOpen={isInchargeModalOpen}
                handleColse={() => setInchargeModalOpen(false)}
                onInchargeSelect={(id, name) => {
                    setSelectedIncharge(id);
                    setSelectedInchargeName(name);
                }}
            />

            {/* 입고창고 모달관리 */}
            <StorageSearchModal
                handleOpen={isStorageModalOpen}
                handleColse={() => setStorageModalOpen(false)}
                onStorageSelect={(code, name) => {
                    setSelectedStorage(code);
                    setSelectedStorageName(name);
                }}
            />

            <hr />

            <Table height={300} data={orderItems} style={{ maxWidth: 1500 }}>
                <Column width={120} align="center">
                    <HeaderCell>물품코드</HeaderCell>
                    <EditableCell dataKey="item_code" onChange={handleChange} editable />
                </Column>
                {/*             
                <Column width={120} align="center">
                    <HeaderCell>물품명</HeaderCell>
                    <EditableCell dataKey="item_name" onChange={handleChange} editable />
                </Column>
              */}
                <Column width={120} align="center">
                    <HeaderCell>수량</HeaderCell>
                    <EditableNumberCell dataKey="quantity" onChange={handleChange} editable />
                </Column>

                <Column width={120} align="center">
                    <HeaderCell>단가</HeaderCell>
                    <EditableNumberCell dataKey="price" onChange={handleChange} editable />
                </Column>

                <Column width={120} align="center">
                    <HeaderCell>공급가액</HeaderCell>
                    <Cell dataKey="supply" />
                </Column>

                <Column width={120} align="center">
                    <HeaderCell>부가세</HeaderCell>
                    <Cell dataKey="vat" />
                </Column>

                <Column width={120} align="center">
                    <HeaderCell>총액</HeaderCell>
                    <Cell dataKey="total" />
                </Column>

                <Column width={60} align="center">
                    <HeaderCell>삭제</HeaderCell>
                    <Cell>
                        {rowData => (
                            <img
                                src={ashBn}
                                alt="돋보기"
                                width={20}
                                height={20}
                                onClick={() => handleDeleteRow(rowData.id)}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    </Cell>
                </Column>
            </Table>

            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1500 }}>
                <Button appearance="primary" onClick={handleAddRow}>행 추가</Button>
                <Button appearance="primary" onClick={handleSubmit} style={{ width: 150, marginBottom: 10 }}>입력</Button>
                <div style={{ fontWeight: 'bold' }}>총액 합계: {totalSum.toLocaleString()} 원</div>
            </div>

            <hr />

        </Container>
    );
}
