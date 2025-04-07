// 구매팀 - 구매입력 페이지
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from "react";
import { Button, Container, DatePicker, Divider, Input, InputGroup, InputNumber, InputPicker, Message, Table } from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import { useNavigate } from "@remix-run/react";
import BuyOrderItemList from "#components/buy/BuyOrderItemList.jsx";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import BuyInsertOrderItem from "#components/buy/BuyInsertOrderItem.jsx";
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
    (item) => ({ // 이렇게 하면, 둘다 같게 들어가서, 라벨따로 값따로 안넣어줘도 됩니다.
        label: item, // Eugenia
        value: item, // Eugenia
    })
);

// 렌더링되는 테이블 => 문자열 (itemCode, itemName)
const EditableCell = ({ rowData, dataKey, onChange, editable, ...props }) => (
    <Cell {...props}>
        {editable ? (
            <Input
                size="xs"
                value={rowData[dataKey]}
                onChange={(value) => onChange(rowData.id, dataKey, value)}
            />
        ) : (
            rowData[dataKey]
        )}
    </Cell>
);

// 렌더링되는 테이블 => 숫자 (quantity, price)
const EditableNumberCell = ({ rowData, dataKey, onChange, editable, ...props }) => (
    <Cell {...props}>
        {editable ? (
            <InputNumber
                size="xs"
                value={rowData[dataKey]}
                onChange={(value) => onChange(rowData.id, dataKey, value)}
            />
        ) : (
            rowData[dataKey]
        )}
    </Cell>
);

const styles = {
    backgroundColor: '#f8f9fa',
};

export default function BuyInsert() {

    const navigate = useNavigate();

    // data는 테이블에 표시될 품목 배열 => 자동 계산되는 supply, vat, total은 후에 동적으로 추가됨
    const [Order, setOrder] = useState([
        {
            order_id: '',
            itemCode: '',
            itemName: '',
            quantity: null,
            price: null,
        },
    ]);

    // // React Query를 이용한 API 연결
    // const mutation = useMutation({ // useMutation을 통해 전표 등록 API와 연결됨
    //     mutationFn: saveOrder,  // saveOrder는 POST 요청을 보내는 함수 (axios.post('/api/orders'))
    //     onSuccess: () => {
    //         toaster.push(<Message showIcon type="success">전표가 저장되었습니다.</Message>);
    //     },
    //     onError: () => {
    //         toaster.push(<Message showIcon type="error">저장에 실패했습니다.</Message>);
    //     }
    // });

    // 값 입력 시 데이터 업데이트 및 자동 계산 => 계산된 값은 state에 반영되어 UI에 즉시 표시됨
    const handleChange = (id, key, value) => {
        const nextData = data.map((row) => {
            if (row.id === id) {
                const updated = { ...row, [key]: value };
                const qty = Number(updated.quantity) || 0;
                const price = Number(updated.price) || 0;
                const supply = qty * price;
                const vat = Math.floor(supply * 0.1);
                const total = supply + vat;
                return { ...updated, supply, vat, total };
            }
            return row;
        });

        setData(nextData);
    };

    // 행 추가 기능
    const handleAddRow = () => {
        const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
        setData([...data, { order_id: newId, itemCode: '', itemName: '', quantity: 0, price: 0 }]);
    };

    // 전표 등록 (API 호출)
    const handleSave = () => {
        const orderData = {
            orderDate: new Date().toISOString().slice(0, 10),
            clientCode: 1001,   // 현재 하드코딩 (나중에 폼연결 예정)
            storageCode: 10,    // 현재 하드코딩 (나중에 폼연결 예정)
            items: data.map(({ order_id, ...item }) => item),
        };
        mutation.mutate(orderData);
    };

    // 합계 계산
    const totalSum = data.reduce((acc, row) => acc + (row.total || 0), 0);

    const submitBuyOrder = (e) => {
        e.preventDefault();     // submit이 action을 안타고 자기 할일을 그만한다.
        fetch("http://localhost:8081/buy/buyOrderItemInsert", {  // 스프링부트
            method: "POST",
            headers: {
                "content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data) //javascript 오브젝트를 json으로 변경해서 넘긴다. 저장한 데이터를 스프링부트에서 insert하고 201을 리턴
        })
            .then((res) => {
                console.log(1, res);
                if (res.status === 201) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then((res) => {    // catch는 여기서 오류가 발생해야 실행됨
                console.log('정상', res);
                if (res !== null) {
                    console.log('navigate', navigate)
                    navigate('/orderList')  // old버전 : props.history.push('/boardList');
                } else {
                    alert("주문 작성에 실패하였습니다.");

                }
            })
            .catch((error) => {
                console.log('실패', error);
            })
    };

    // 거래처 모달 관리
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [isClientModalOpen, setClientModalOpen] = useState(false);

    const handleClientSelect = (client_code, client_name) => {
        setSelectedClient(client_code);
        setSelectedClientName(client_name);
        setClientModalOpen(false);
    };

    const handleOpenClientModal = () => {
        setClientModalOpen(true);
    };

    // 담당자 모달 관리
    const [selectedIncharge, setSelectedIncharge] = useState(null);
    const [selectedInchargeName, setSelectedInchargeName] = useState(null);
    const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);

    const handleInchargeSelect = (e_id, e_name) => {
        setSelectedIncharge(e_id);
        setSelectedInchargeName(e_name);
        setClientModalOpen(false);
    };

    const handleOpenInchargeModal = () => {
        setInchargeModalOpen(true);
    };

    // 입고창고 모달관리
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageName, setSelectedStorageName] = useState(null);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);

    const handleStorageSelect = (storage_code, storage_name) => {
        setSelectedStorage(storage_code);
        setSelectedStorageName(storage_name);
        setClientModalOpen(false);
    };

    const handleOpenStorageModal = () => {
        setStorageModalOpen(true);
    };


    return (
        <Container>
            <Message type="info" style={{ maxWidth: 1500 }}>
                <strong>구매입력</strong>
            </Message>
            <br />

            <div className="inputBox" >
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>
                        일자
                    </InputGroup.Addon>
                    <DatePicker/>
                    <Input
                        name="order_date"
                        value={Order_date}
                    />
                </InputGroup>

                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>
                        담당자
                    </InputGroup.Addon>
                    <Input
                        placeholder='담당자 입력'
                        value={selectedIncharge || ""} readOnly
                    />
                    <InputGroup.Button tabIndex={-1}>
                        {/* 모달 열기 버튼 */}
                        <SearchIcon onClick={handleOpenInchargeModal} />
                    </InputGroup.Button>
                </InputGroup>
                <Input name="customer_1" type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
                    value={selectedInchargeName || ""} readOnly />

                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>
                        거래처
                    </InputGroup.Addon>
                    <Input placeholder='거래처'
                        value={selectedClient || ""} readOnly
                    />
                    <InputGroup.Addon>
                        <SearchIcon onClick={handleOpenClientModal} />
                    </InputGroup.Addon>
                </InputGroup>
                <Input type="text" autoComplete="off" style={{ width: 150, marginBottom: 5 }}
                    value={selectedClientName || ""} readOnly />
            </div>

            <div className="inputBox">
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>
                        거래유형
                    </InputGroup.Addon>
                    <InputPicker
                        placeholder='거래유형 선택'
                        data={buyType}
                        style={{ width: 224, border: 'none', height: 38 }}
                    />
                </InputGroup>
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>
                        입고창고
                    </InputGroup.Addon>
                    <Input placeholder='입고창고'
                        value={selectedStorage || ""} readOnly
                    />
                    <InputGroup.Addon>
                        <SearchIcon onClick={handleOpenStorageModal}/>
                    </InputGroup.Addon>
                </InputGroup>
                <Input type="text" autoComplete="off" style={{ width: 150, marginBottom: 5}}
                    value={selectedStorageName || ""} readOnly />
        
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>
                        품목코드
                    </InputGroup.Addon>
                    <Input placeholder='품목코드' />
                </InputGroup>
            </div>
            {/* <Uploader action="//jsonplaceholder.typicode.com/posts/">
                    <Button style={{ width: 300, height: 40 }} color="green" appearance="ghost">전표등록</Button>
                </Uploader>     */}

            <InchargeSearchModal
                title="담당자 선택"
                confirm="확인"
                cancel="취소"
                onInchargeSelect={handleInchargeSelect}	// emid, Incharge 받기
                handleOpen={isInchargeModalOpen}
                handleColse={() => setInchargeModalOpen(false)}
            />

            <ClientSearchModal
                title="거래처 선택"
                confirm="확인"
                cancel="취소"
                onClientSelect={handleClientSelect}	// client_code, client_name 받기
                handleOpen={isClientModalOpen}
                handleColse={() => setClientModalOpen(false)}
            />

            <StorageSearchModal
                title="입고창고 선택"
                confirm="확인"
                cancel="취소"
                onStorageSelect={handleStorageSelect}	// client_code, client_name 받기
                handleOpen={isStorageModalOpen}
                handleColse={() => setStorageModalOpen(false)}
            />


            <hr />

            <div>
                <Table height={300} data={data} style={{ maxWidth: 1500 }}>
                    <Column width={100} align="center" fixed>
                        <HeaderCell>물품코드</HeaderCell>
                        <EditableCell dataKey="itemCode" onChange={handleChange} editable />
                    </Column>

                    <Column width={150} align="center">
                        <HeaderCell>물품명</HeaderCell>
                        <EditableCell dataKey="itemName" onChange={handleChange} editable />
                    </Column>

                    <Column width={80} align="center">
                        <HeaderCell>수량</HeaderCell>
                        <EditableNumberCell dataKey="quantity" onChange={handleChange} editable />
                    </Column>

                    <Column width={100} align="center">
                        <HeaderCell>단가</HeaderCell>
                        <EditableNumberCell dataKey="price" onChange={handleChange} editable />
                    </Column>

                    <Column width={100} align="center">
                        <HeaderCell>공급가액</HeaderCell>
                        <Cell dataKey="supply" />
                    </Column>

                    <Column width={80} align="center">
                        <HeaderCell>부가세</HeaderCell>
                        <Cell dataKey="vat" />
                    </Column>

                    <Column width={100} align="center">
                        <HeaderCell>총액</HeaderCell>
                        <Cell dataKey="total" />
                    </Column>
                </Table>

                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1500 }}>
                    <Button appearance="primary" onClick={handleAddRow}>
                        행 추가
                    </Button>
                    <Button appearance="primary" type="submit" onClick={submitBuyOrder} style={{ width: 150, marginBottom: 10 }}>
                        입력
                    </Button>

                    {/* <Button appearance="primary" color="green" onClick={handleSave} disabled={mutation.isLoading}>
                        전표 등록
                    </Button> */}
                    <div style={{ fontWeight: 'bold' }}>총액 합계: {totalSum.toLocaleString()} 원</div>
                </div>
            </div>
    
            <hr />    
            <BuyInsertOrderItem /> 

            <hr />
            <BuyOrderItemList />

        </Container>
    );
};
