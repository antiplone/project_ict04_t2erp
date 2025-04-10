// 구매팀 - 구매현황 조회 페이지
/* eslint-disable react/react-in-jsx-scope */
import * as rs from 'rsuite';
import Table from 'rsuite/Table';
import SearchIcon from '@rsuite/icons/Search';
import React, { useState } from "react";
import "../styles/buy.css";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import ItemSearchModal from "#components/buy/ItemSearchModal.jsx";

export function meta() {
    return [
        { title: "구매현황조회" },
        { name: "description", content: "구매현황조회" },
    ];
};

const { Column, HeaderCell, Cell } = Table;

/* 거래유형 - 선택 데이터 */
const buyType = ["부과세율 적용", "부가세율 미적용"].map(
    (item) => ({ label: item, value: item })
);

const searchStyle = { width: 100 };

export default function BuyStatusSelect() {
    const [orderDate, setOrderDate] = useState(new Date());
    const [selectedType, setSelectedType] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [isClientModalOpen, setClientModalOpen] = useState(false);
    const [selectedIncharge, setSelectedIncharge] = useState(null);
    const [selectedInchargeName, setSelectedInchargeName] = useState(null);
    const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageName, setSelectedStorageName] = useState(null);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState([]);

    const handleSearch = async () => {
        const searchParams = {
            order_date: orderDate.toISOString().slice(0, 10),
            client_code: selectedClient,
            e_id: selectedIncharge,
            storage_code: selectedStorage,
            item_code: selectedItem,
            transaction_type: selectedType
        };

        try {
            const query = new URLSearchParams(searchParams).toString();
            const res = await fetch("http://localhost:8081/buy/buyStatusSearch");
            const result = await res.json();
            setOrderStatus(result);
        } catch (err) {
            console.error("검색 실패:", err);
        }
    };

    return (
        <rs.Container>
            <>
                <rs.Message type="info" style={{ width: 960 }}>
                    <strong>구매현황</strong>
                </rs.Message>
                <br />

                <div className="inputBox">
                    <rs.InputGroup className="input">
                        <rs.InputGroup.Addon style={{ width: 80 }}>일자</rs.InputGroup.Addon>
                        <rs.DatePicker value={orderDate} onChange={setOrderDate} />
                    </rs.InputGroup>

                    <rs.InputGroup className="input">
                        <rs.InputGroup.Addon style={{ width: 80 }}>담당자</rs.InputGroup.Addon>
                        <rs.Input value={selectedIncharge || ""} readOnly />
                        <rs.InputGroup.Button tabIndex={-1}>
                            <SearchIcon onClick={() => setInchargeModalOpen(true)} />
                        </rs.InputGroup.Button>
                    </rs.InputGroup>
                    <rs.Input value={selectedInchargeName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />

                    <rs.InputGroup className="input">
                        <rs.InputGroup.Addon style={{ width: 80 }}>거래처</rs.InputGroup.Addon>
                        <rs.Input value={selectedClient || ""} readOnly />
                        <rs.InputGroup.Addon>
                            <SearchIcon onClick={() => setClientModalOpen(true)} />
                        </rs.InputGroup.Addon>
                    </rs.InputGroup>
                    <rs.Input value={selectedClientName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />
                </div>

                <div className="inputBox">
                    <rs.InputGroup className="input">
                        <rs.InputGroup.Addon style={{ width: 80 }}>거래유형</rs.InputGroup.Addon>
                        <rs.InputPicker placeholder="거래유형 선택" data={buyType} style={{ width: 224 }} value={selectedType} onChange={setSelectedType} />
                    </rs.InputGroup>

                    <rs.InputGroup className="input">
                        <rs.InputGroup.Addon style={{ width: 80 }}>입고창고</rs.InputGroup.Addon>
                        <rs.Input value={selectedStorage || ""} readOnly />
                        <rs.InputGroup.Addon>
                            <SearchIcon onClick={() => setStorageModalOpen(true)} />
                        </rs.InputGroup.Addon>
                    </rs.InputGroup>
                    <rs.Input value={selectedStorageName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />

                    <rs.InputGroup className="input">
                        <rs.InputGroup.Addon style={{ width: 80 }}> 품목코드</rs.InputGroup.Addon>
                        <rs.Input value={selectedItem || ""} readOnly />
                        <rs.InputGroup.Addon>
                            <SearchIcon onClick={() => setItemModalOpen(true)} />
                        </rs.InputGroup.Addon>
                    </rs.InputGroup>
                    <rs.Input value={selectedItemName || ""} readOnly style={{ width: 150, marginBottom: 5 }} />
                </div>

                <ClientSearchModal handleOpen={isClientModalOpen} handleColse={() => setClientModalOpen(false)} onClientSelect={(code, name) => { setSelectedClient(code); setSelectedClientName(name); }} />
                <InchargeSearchModal handleOpen={isInchargeModalOpen} handleColse={() => setInchargeModalOpen(false)} onInchargeSelect={(id, name) => { setSelectedIncharge(id); setSelectedInchargeName(name); }} />
                <StorageSearchModal handleOpen={isStorageModalOpen} handleColse={() => setStorageModalOpen(false)} onStorageSelect={(code, name) => { setSelectedStorage(code); setSelectedStorageName(name); }} />
                <ItemSearchModal handleOpen={isItemModalOpen} handleColse={() => setItemModalOpen(false)} onItemSelect={(code, name) => { setSelectedItem(code); setSelectedItemName(name); }} />

                <rs.Button appearance="primary" onClick={handleSearch} style={searchStyle}>검색</rs.Button>
                <hr />

                <Table height={400} width={960} data={orderStatus} onRowClick={itemData => console.log(itemData)}>
                    <Column width={160}><HeaderCell>일자-No.</HeaderCell><Cell dataKey="order_date" /></Column>
                    <Column width={160}><HeaderCell>거래처명</HeaderCell><Cell dataKey="client_name" /></Column>
                    <Column width={160}><HeaderCell>품목명 [규격]</HeaderCell><Cell dataKey="item_name" /></Column>
                    <Column width={160}><HeaderCell>수량</HeaderCell><Cell dataKey="quantity" /></Column>
                    <Column width={160}><HeaderCell>단가</HeaderCell><Cell dataKey="price" /></Column>
                    <Column width={160}><HeaderCell>금액합계</HeaderCell><Cell dataKey="total" /></Column>
                </Table>
            </>
        </rs.Container>
    );
};
