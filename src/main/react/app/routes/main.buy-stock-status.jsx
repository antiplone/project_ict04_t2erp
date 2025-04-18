// 구매팀 - 입고현황 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import { DateRangePicker, Input, InputGroup, InputPicker, Table } from 'rsuite';
import React, { useState } from "react";
import "../styles/buy.css";
import { Button, Container, Divider, Message } from "rsuite";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import ItemSearchModal from "#components/buy/ItemSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";

export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매관리 - 입고조회` },
        { name: "description", content: "구매관리에서 입고조회하는 페이지 입니다." },
    ];
};

const { Column, HeaderCell, Cell } = Table;

export default function BuyStockStatus() {

    // 발주 일자
    const [orderDate, setOrderDate] = useState(null);

    // 날짜 선택
    const handleDateChange = (value) => {
        console.log("선택된 날짜 범위:", value); // [startDate, endDate]
        setOrderDate(value);
    };

    // 거래처 모달관리
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [isClientModalOpen, setClientModalOpen] = useState(false);

    // 입고 창고 모달 관리
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageName, setSelectedStorageName] = useState(null);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);

    // 물품 모달 관리
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);

    // 검색 키워드
    const [searchKeyword, setSearchKeyword] = useState("");

    // 입고확인
    const [buyStockStatus, setBuyStockStatus] = useState([]);

    // 선택한 조건 검색 
    const handleSearch = async () => {
        let startDate = '';
        let endDate = '';

        if (orderDate && orderDate.length === 2) {
            startDate = orderDate[0].toLocaleDateString('sv-SE');
            endDate = orderDate[1].toLocaleDateString('sv-SE');
        }

        const searchParams = {
            start_date: startDate,
            end_date: endDate,
            order_id: searchKeyword,
            client_code: selectedClient,
            storage_code: selectedStorage,
            item_code: selectedItem,
        };

        // 빈 값, 널은 쿼리에서 제외 (정확한 검색 필터링을 위해)
        const cleanedParams = Object.fromEntries(
            Object.entries(searchParams).filter(([_, value]) => value !== null && value !== '')
        );

        // URL 쿼리 생성
        const query = new URLSearchParams(cleanedParams).toString();

        const fetchURL = AppConfig.fetch['mytest']

        try {
            const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyStockStatusSearch?${query}`);
            const result = await res.json();
            console.log("buyStockStatus:", result);

            if (result.length === 0) {
                alert("선택한 조건에 해당하는 입고정보가 없습니다.");
            }

            setBuyStockStatus(result);
        } catch (err) {
            console.error("검색 실패:", err);
        }
    };

    // 엑셀로 다운로드 
    const downloadExcel = () => {
        let startDate = '';
        let endDate = '';

        if (orderDate && orderDate.length === 2) {
            startDate = orderDate[0].toLocaleDateString('sv-SE');
            endDate = orderDate[1].toLocaleDateString('sv-SE');
        }

        const searchParams = {
            start_date: startDate,
            end_date: endDate,
            client_code: selectedClient,
            storage_code: selectedStorage,
            item_code: selectedItem
        };

        const cleanedParams = Object.fromEntries(
            Object.entries(searchParams).filter(([_, v]) => v !== null && v !== "")
        );

        const query = new URLSearchParams(cleanedParams).toString();

        window.open(`${AppConfig.fetch.mytest.protocol}${AppConfig.fetch.mytest.url}/buy/exportStockStatusExcel?${query}`, "_blank");
    };

    const styles = {
        backgroundColor: '#f8f9fa',
    };

    return (
        <>
            <Container>

                <Message type="info" style={{ width: 1500 }}>
                    <strong>구매관리 - 입고조회</strong>
                </Message>
                <br />

                <div className="inputBox">
                    <InputGroup className="input">
                        <InputGroup.Addon style={{ width: 80 }}>발주일자</InputGroup.Addon>
                        <DateRangePicker
                            value={orderDate}
                            onChange={handleDateChange}
                            format="yyyy-MM-dd"
                            placeholder="날짜 선택"
                        />
                    </InputGroup>

                    <InputGroup className="input">
                        <InputGroup.Addon style={{ width: 80 }}>발주번호</InputGroup.Addon>
                        <Input
                            placeholder="발주번호 입력"
                            value={searchKeyword}
                            onChange={setSearchKeyword}
                        />
                    </InputGroup>

                    <InputGroup className="input">
                        <InputGroup.Addon style={{ width: 80 }}>거래처</InputGroup.Addon>
                        <Input value={selectedClient || ""} readOnly onClick={() => setClientModalOpen(true)} />
                        <InputGroup.Addon>
                            <img
                                src={readingGlasses}
                                alt="돋보기"
                                width={20}
                                height={20}
                                style={{ cur: "pointer" }}
                            />
                        </InputGroup.Addon>
                    </InputGroup>
                    <Input value={selectedClientName || ""} readOnly style={{ width: 250 }} />
                </div>

                <div className="inputBox">
                    <InputGroup className="input">
                        <InputGroup.Addon style={{ width: 80 }}>입고창고</InputGroup.Addon>
                        <Input value={selectedStorage || ""} readOnly onClick={() => setStorageModalOpen(true)} />
                        <InputGroup.Addon>
                            <img
                                src={readingGlasses}
                                alt="돋보기"
                                width={20}
                                height={20}
                                style={{ cur: "pointer" }}
                            />
                        </InputGroup.Addon>
                    </InputGroup>
                    <Input value={selectedStorageName || ""} readOnly style={{ width: 250 }} />

                    <InputGroup className="input">
                        <InputGroup.Addon style={{ width: 80 }}> 품목코드</InputGroup.Addon>
                        <Input value={selectedItem || ""} readOnly onClick={() => setItemModalOpen(true)} />
                        <InputGroup.Addon>
                            <img
                                src={readingGlasses}
                                alt="돋보기"
                                width={20}
                                height={20}
                                style={{ cur: "pointer" }}
                            />
                        </InputGroup.Addon>
                    </InputGroup>
                    <Input value={selectedItemName || ""} readOnly style={{ width: 250 }} />
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
                    onItemSelect={(code, name) => {
                        setSelectedItem(code);
                        setSelectedItemName(name);
                    }}
                />

               <div className="buyBtnBox">
                <Button appearance="ghost" color="green" onClick={handleSearch} className="statusSearchBtn">검색</Button>
                <Button appearance="ghost" color="blie" onClick={downloadExcel} className="statusExcelBtn">엑셀 다운로드</Button>
                </div>

                <Divider style={{ maxWidth: 1200 }} />
                <>
                    <Table height={500} width={1200} data={buyStockStatus} onRowClick={ReceivingData => console.log(ReceivingData)}>
                        <Column width={150}><HeaderCell style={styles}>발주일자</HeaderCell><Cell dataKey="order_date" /></Column>
                        <Column width={150}><HeaderCell style={styles}>발주번호</HeaderCell><Cell dataKey="order_id" /></Column>
                        <Column width={150}><HeaderCell style={styles}>거래처명</HeaderCell><Cell dataKey="client_name" /></Column>
                        <Column width={150}><HeaderCell style={styles}>물품명</HeaderCell><Cell dataKey="item_name" /></Column>
                        <Column width={150}><HeaderCell style={styles}>창고명</HeaderCell><Cell dataKey="storage_name" /></Column>
                        <Column width={150}><HeaderCell style={styles}>창고재고</HeaderCell><Cell dataKey="stock_amount" /></Column>
                        <Column width={150}><HeaderCell style={styles}>안전재고</HeaderCell><Cell dataKey="safe_stock" /></Column>
                        <Column width={150}><HeaderCell style={styles}>최근 입고일</HeaderCell><Cell dataKey="last_date" /></Column>
                    </Table>
                </>

            </Container>

            <Divider style={{ maxWidth: 1200 }} />

        </>
    );
};
