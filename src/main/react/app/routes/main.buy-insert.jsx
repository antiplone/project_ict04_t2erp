// 구매팀 - 구매입력 페이지
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import React, { useState } from "react";
import { Button, Container, DatePicker, Divider, Input, InputGroup, InputNumber, InputPicker, Message, Table, toaster } from "rsuite";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import { useNavigate } from "@remix-run/react";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import "../styles/buy.css";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";
import ashBn from "#images/common/ashBn.png";
import ItemSearchModal from "#components/buy/ItemSearchModal.jsx";
import { useToast } from '#components/common/ToastProvider';
import MessageBox from '../components/common/MessageBox';

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
const EditableCell = ({ rowData, dataKey, onChange, editable, onDoubleClickCell, ...props }) => (
    <Cell {...props} onDoubleClick={() => onDoubleClickCell?.(rowData.id)}>
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
            new Intl.NumberFormat().format(Number(rowData?.[dataKey]) || 0)
        )}
    </Cell>
);

export default function BuyInsert() {

    const navigate = useNavigate();

    const { showToast } = useToast();

    // 물품 입력 목록 저장
    const [orderItems, setOrderItems] = useState([
        { id: 1, order_id: 1, item_code: '', quantity: 0, price: 0, supply: 0, vat: 0, total: 0 },
    ]);

    // 납기일자
    const [deliveryDate, setDeliveryDate] = useState(null);

    // 거래유형
    const [selectedType, setSelectedType] = useState('');

    // 물품 모달관리
    const [isItemModalOpen, setItemModalOpen] = useState(null);

    // 현재 편집중인 셀
    const [currentEditId, setCurrentEditId] = useState(null);


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

    // 물품 금액 자동 계산
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
    const handleAdditem = () => {
        // 현재 입력된 모든 행의 id 값만 추출 ex) [{id:1}, {id:2}, {id:5}] → [1, 2, 5] / 현재 존재하는 id 중 가장 큰 값을 찾아서 +1을 한다.
        const newId = orderItems.length > 0
            ? Math.max(...orderItems.map(d => d.id)) + 1
            : 1;
        setOrderItems([
            ...orderItems, // 기존 물품정보에
            {
                id: newId,  // 새 물품정보들을 맨 뒤에 추가한다.
                item_code: '',
                item_name: '',
                quantity: 0,
                price: 0,
                supply: 0,
                vat: 0,
                total: 0
            }
        ]);
    };

    // 행 삭제
    const handleDeleteItem = (id) => {
        const filtered = orderItems.filter(order => order.id !== id);
        setOrderItems(filtered);// 필터링된 배열로 orderItems 상태를 업데이트한다.
    };

    // 총액 합계 계산 
    // reduce는 배열의 각 항목을 순차적으로 처리 => 하나의 결과 값을 받환 (acc: 누적값, order: 현재 항목) / null 일 경우 0으로 대체
    const totalSum = orderItems.reduce((acc, order) => acc + (order.total || 0), 0);

    const fetchURL = AppConfig.fetch["mytest"];

    // 입력한 정보 저장
    const handleSubmit = async () => {
        if (!selectedClient || !selectedIncharge || !selectedStorage || !selectedType) { // 거래처, 담당자, 입고창고, 거래유형 중 하나라도 선택하지 않으면 입력하라는 알림이 뜬다.
            showToast("주문 정보를 모두 입력해주세요.", "warning");
            return;
        }
        // 필수 항목 누락된 물품 체크
        const isInvalidItem = orderItems.some(item =>
            item.item_code === null || item.item_code === '' || isNaN(item.item_code)
        );
        if (isInvalidItem) {
            showToast("물품코드를 정확히 입력해주세요.", "warning");
            return;
        }

        const orderDate = new Date().toLocaleString("sv-SE", {timeZone: "Asia/Seoul"}).replace(" ","T");

        // 백엔드에 보낼 데이터
        try {
            const requestBody = {
                
                order: { // order 주문정보
                    order_date: orderDate,
                    delivery_date: deliveryDate.toLocaleDateString('sv-SE'), // 브라우저 기준 날짜, 'YYYY-MM-DD' 형식으로 변환
                    client_code: selectedClient,
                    e_id: selectedIncharge,
                    storage_code: selectedStorage,
                    transaction_type: selectedType,
                    order_type: 2, // 2는 구매팀 주문입력건
                },
                items: orderItems.map(({ id, ...item }) => item) // items 물품 목록 배열, 프론트용 id는 제거
            };

            // REST API 방식으로 백엔드 경로로 요청
            const response = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyInsertAll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // json으로 데이터 전달
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                showToast("주문 저장을 실패했습니다.", "error");
                return;
            }
            showToast("주문이 정상 등록되었습니다.", "success");

            navigate("/main/buy-select");

        } catch (err) {
            console.error(err);
            showToast("오류가 발생했습니다.", "error");
        }
    };

    // 검색 필터 초기화
    const handleResetInput = () => {
        setDeliveryDate(null);
        setSelectedIncharge(null);
        setSelectedInchargeName(null);
        setSelectedClient(null);
        setSelectedClientName(null);
        setSelectedType(null);
        setSelectedStorage(null);
        setSelectedStorageName(null);
    }

    return (
        <Container >
            <MessageBox type="info" text="구매입력" />
            <br />

            <div className="inputBox">
                <div className="input">
                    <InputGroup className="input_date_type">
                        <InputGroup.Addon style={{ width: 90 }}>납기일자</InputGroup.Addon>
                        <DatePicker
                            value={deliveryDate}   // 현재 선택된 날짜
                            onChange={setDeliveryDate} // 날짜가 변경될 때 상태 업데이트
                            placeholder="날짜 선택"
                            format="yyyy-MM-dd"
                        />
                    </InputGroup>
                </div>

                <div className="input">
                    <InputGroup className="inputModal">
                        <InputGroup.Addon style={{ width: 90 }}>담당자</InputGroup.Addon>
                        <Input value={selectedIncharge || ""} readOnly onClick={() => setInchargeModalOpen(true)} /> {/* 모달을 통해 입력하기 때문에 input에서는 수정불가하게 readOnly 처리 */}
                        <InputGroup.Button tabIndex={-1} >
                            <img
                                src={readingGlasses}
                                alt="돋보기"
                                width={20}
                                height={20}
                                style={{ cursor: "pointer" }}
                            />
                        </InputGroup.Button>
                    </InputGroup>
                    <Input value={selectedInchargeName || ""} readOnly className="inputModalSide" />
                </div>

                <div className="input">
                    <InputGroup className="inputModal">
                        <InputGroup.Addon style={{ width: 90 }}>거래처</InputGroup.Addon>
                        <Input value={selectedClient || ""} readOnly onClick={() => setClientModalOpen(true)} />
                        <InputGroup.Addon>
                            <img
                                src={readingGlasses}
                                alt="돋보기"
                                width={20}
                                height={20}
                                style={{ cursor: "pointer" }}
                            />
                        </InputGroup.Addon>
                    </InputGroup>
                    <Input value={selectedClientName || ""} readOnly className="inputModalSide" />
                </div>
            </div>

            <div className="inputBox">
                <div className="input">
                    <InputGroup className="input_date_type">
                        <InputGroup.Addon style={{ width: 90 }}>거래유형</InputGroup.Addon>
                        <InputPicker
                            placeholder="거래유형 선택"
                            data={buyType} // 거래유형 리스트 
                            style={{ width: 224, border: 'none' }}
                            value={selectedType} // 현재 선택된 값
                            onChange={setSelectedType} // 사용자 선택값 업데이트
                        />
                    </InputGroup>
                </div>

                <div className="input">
                    <InputGroup className="inputModal">
                        <InputGroup.Addon style={{ width: 90 }}>입고창고</InputGroup.Addon>
                        <Input value={selectedStorage || ""} readOnly onClick={() => setStorageModalOpen(true)} />
                        <InputGroup.Addon>
                            <img
                                src={readingGlasses}
                                alt="돋보기"
                                width={20}
                                height={20}
                                style={{ cursor: "pointer" }}
                            />
                        </InputGroup.Addon>
                    </InputGroup>
                    <Input value={selectedStorageName || ""} readOnly className="inputModalSide" />
                </div>
            </div>

            <div className="buyBtnBox">
                <Button appearance="ghost" className="buyBtn" onClick={handleAdditem}>입력 추가</Button>
                <Button color="green" appearance="ghost" type="submit" className="buyBtn" onClick={handleResetInput}>
                    초기화
                </Button>
            </div>

            <Divider />

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

            {/* 물품 모달 관리 */}
            <ItemSearchModal
                handleOpen={isItemModalOpen}
                handleColse={() => setItemModalOpen(false)}
                onItemSelect={(item_code, item_name) => {
                    setOrderItems(prev =>
                        prev.map(row => row.id === currentEditId
                            ? { ...row, item_code, item_name }
                            : row
                        )
                    );
                    setItemModalOpen(false);
                }}
            />

            <hr />

            <Table height={400} data={orderItems} style={{ maxWidth: 1350, marginTop: -40 }}>
                <Column width={170} align="center">
                    <HeaderCell>물품코드</HeaderCell>
                    <EditableCell
                        dataKey="item_code"
                        onChange={handleChange}
                        editable
                        onDoubleClickCell={(id) => {
                            setCurrentEditId(id); // 현재 편집 중인 행 저장
                            setItemModalOpen(true);
                        }}
                    />
                </Column>

                <Column width={170} className='text_center'>
                    <HeaderCell className='text_center'>물품명</HeaderCell>
                    <EditableCell dataKey="item_name" onChange={handleChange} editable />
                </Column>

                <Column width={160} className='text_center'>
                    <HeaderCell className='text_center'>수량</HeaderCell>
                    <EditableNumberCell dataKey="quantity" onChange={handleChange} editable />
                </Column>

                <Column width={160} className='text_center'>
                    <HeaderCell className='text_center'>단가</HeaderCell>
                    <EditableNumberCell dataKey="price" onChange={handleChange} editable />
                </Column>

                <Column width={160} className='text_right'>
                    <HeaderCell className='text_center'>공급가액</HeaderCell>
                    <Cell>
                        {supplyData => new Intl.NumberFormat().format(supplyData.supply)}
                    </Cell>
                </Column>

                <Column width={160} className='text_right'>
                    <HeaderCell className='text_center'>부가세</HeaderCell>
                    <Cell>
                        {vatData => new Intl.NumberFormat().format(vatData.vat)}
                    </Cell>
                </Column>

                <Column width={160} className='text_right'>
                    <HeaderCell className='text_center'>금액합계</HeaderCell>
                    <Cell>
                        {totalData => new Intl.NumberFormat().format(totalData.total)}
                    </Cell>
                </Column>

                <Column width={180} className='text_center'>
                    <HeaderCell className='text_center'>삭제</HeaderCell>
                    <Cell>
                        {rowData => (
                            <img
                                src={ashBn}
                                alt="돋보기"
                                width={20}
                                height={20}
                                onClick={() => handleDeleteItem(rowData.id)}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    </Cell>
                </Column>
            </Table>

            <Divider />
            <div className="insertTotalSum">총액 합계: {totalSum.toLocaleString()} 원</div>
            <div style={{ display: 'flex', marginLeft: 10 }}>
                <Button appearance="ghost" onClick={handleSubmit}>저장</Button>
            </div>
            <hr />
        </Container>
    );
}
