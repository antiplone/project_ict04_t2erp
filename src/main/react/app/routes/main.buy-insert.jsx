// 구매팀 - 구매입력 페이지
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from "react";
import { Button, Container, DatePicker, Divider, Input, InputGroup, InputNumber, InputPicker, Message, Table, IconButton } from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import TrashIcon from '@rsuite/icons/Trash';
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import { useNavigate } from "@remix-run/react";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import "../styles/buy.css";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";

export function meta() {
    return [
        { title: "구매입력" },
        { name: "description", content: "구매입력" },
    ];
};

const { Column, HeaderCell, Cell } = Table;

/* 거래유형 - 선택 데이터 */
const buyType = ["부과세율 적용", "부가세율 미적용"].map(
    (item) => ({ label: item, value: item })
);

const EditableCell = ({ rowData, dataKey, onChange, editable, ...props }) => (
    <Cell {...props}>
        {editable ? (
            <Input
                size="xs"
                value={rowData[dataKey] || ''}
                onChange={(value) => onChange(rowData.id, dataKey, value)}
            />
        ) : (
            rowData[dataKey]
        )}
    </Cell>
);

const EditableNumberCell = ({ rowData, dataKey, onChange, editable, ...props }) => (
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

    const [orderItems, setOrderItems] = useState([
        { id: 1, item_code: '', quantity: 0, price: 0, supply: 0, vat: 0, total: 0 },
    ]);
    
    // 입력일자
    const [orderDate, setOrderDate] = useState(new Date());
    
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
    
    // 발주번호
    const [orderCode, setOrderCode] = useState("");

    const handleChange = (id, key, value) => {
        const updated = orderItems.map(row => {
            if (row.id === id) {
                const newRow = { ...row, [key]: value };
                const quantity = Number(newRow.quantity) || 0;
                const price = Number(newRow.price) || 0;
                const supply = quantity * price;
                const vat = Math.floor(supply * 0.1);
                const total = supply + vat;
                return { ...newRow, supply, vat, total };
            }
            return row;
        });
        setOrderItems(updated);
    };

    const handleAddRow = () => {
        const newId = orderItems.length > 0 ? Math.max(...orderItems.map(d => d.id)) + 1 : 1;
        setOrderItems([...orderItems, { id: newId, item_code: '', quantity: 0, price: 0, supply: 0, vat: 0, total: 0 }]);
    };

    const handleDeleteRow = (id) => {
        const filtered = orderItems.filter(row => row.id !== id);
        setOrderItems(filtered);
    };

    const totalSum = orderItems.reduce((acc, row) => acc + (row.total || 0), 0);

    const handleSubmit = async () => {
        if (!selectedClient || !selectedIncharge || !selectedStorage || !selectedType) {
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
                    order_date: orderDate.toISOString().slice(0, 10),
                    client_code: selectedClient,
                    e_id: selectedIncharge,
                    storage_code: selectedStorage,
                    transaction_type: selectedType,
                    order_type: 2,
                    order_code: orderCode
                },
                items: orderItems.map(({ id, ...item }) => item)
            };

            const response = await fetch("http://localhost:8081/buy/buyInsertAll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                alert("주문 저장에 실패했습니다.");
                return;
            }

            alert("주문이 정상 등록되었습니다.");
            navigate("/main/buy-insert");
        } catch (err) {
            console.error(err);
            alert("오류 발생");
        }
    };

    return (
        <Container>
            <Message type="info" style={{ maxWidth: 1500 }}>
                <strong>구매입력</strong>
            </Message>
            <br />

            <div className="inputBox">
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>일자</InputGroup.Addon>
                    <DatePicker value={orderDate} onChange={setOrderDate} />
                </InputGroup>

                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>담당자</InputGroup.Addon>
                    <Input value={selectedIncharge || ""} readOnly />
                    <InputGroup.Button tabIndex={-1}>
                        <SearchIcon onClick={() => setInchargeModalOpen(true)} />
                    </InputGroup.Button>
                </InputGroup>
                <Input value={selectedInchargeName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />

                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>거래처</InputGroup.Addon>
                    <Input value={selectedClient || ""} readOnly />
                    <InputGroup.Addon>
                        <SearchIcon onClick={() => setClientModalOpen(true)} />
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
                        <SearchIcon onClick={() => setStorageModalOpen(true)} />
                    </InputGroup.Addon>
                </InputGroup>
                <Input value={selectedStorageName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />

                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>주문번호</InputGroup.Addon>
                    <Input value={orderCode} onChange={setOrderCode} />
                </InputGroup>
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
                            <IconButton icon={<TrashIcon />} size="xs" color="red" onClick={() => handleDeleteRow(rowData.id)} />
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
