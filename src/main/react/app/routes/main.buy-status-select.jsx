// 구매팀 - 구매현황 조회 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import { Divider, Table } from 'rsuite';
import React, { useState } from "react";
import "../styles/buy.css";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import ItemSearchModal from "#components/buy/ItemSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";
import { Button, Container, DateRangePicker, Input, InputGroup, InputPicker, Message } from "rsuite";

export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매현황조회` },
        { name: "description", content: "구매현황조회" },
    ];
};

const { Column, HeaderCell, Cell } = Table;

/* 거래유형 - 선택 데이터 */
const buyType = ["부과세율 적용", "부가세율 미적용"].map(
    (item) => ({ label: item, value: item })
);

export default function BuyStatusSelect() {

    // 발주일자
    const [orderDate, setOrderDate] = useState(null);

    // 날짜 선택
    const handleDateChange = (value) => {
        console.log("선택된 날짜 범위:", value); // [startDate, endDate]
        setOrderDate(value);
    };

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

    // 물품 모달관리
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);

    // 주문상태
    const [orderstatus, setOrderstatus] = useState([]);

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
            client_code: selectedClient,
            e_id: selectedIncharge,
            storage_code: selectedStorage,
            item_code: selectedItem,
            transaction_type: selectedType
        };

        // 빈 값, 널은 쿼리에서 제외 (정확한 검색 필터링을 위해)
        const cleanedParams = Object.fromEntries(
            Object.entries(searchParams).filter(([_, value]) => value !== null && value !== '')
        );

        // URL 쿼리 생성
        const query = new URLSearchParams(cleanedParams).toString();

        const fetchURL = AppConfig.fetch["mytest"];

        try {
            const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyStatusSearch?${query}`);
            const result = await res.json();
            console.log("result:", result);

            if (result.length === 0) {
                alert("선택한 조건에 해당하는 구매정보가 없습니다.");
            }

            setOrderstatus(result);
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
          e_id: selectedIncharge,
          storage_code: selectedStorage,
          item_code: selectedItem,
          transaction_type: selectedType
        };
      
        const cleanedParams = Object.fromEntries(
          Object.entries(searchParams).filter(([_, v]) => v !== null && v !== "")
        );
      
        const query = new URLSearchParams(cleanedParams).toString();
      
        window.open(`${AppConfig.fetch.mytest.protocol}${AppConfig.fetch.mytest.url}/buy/exportOrderStatusExcel?${query}`, "_blank");
      };

    const styles = {
        backgroundColor: '#f8f9fa',
    };

    return (
        <Container>
            <>
                <Message type="info" style={{ width: 1500 }}>
                    <strong>구매현황</strong>
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
                        <InputGroup.Addon style={{ width: 80 }}>담당자</InputGroup.Addon>
                        <Input value={selectedIncharge || ""} readOnly onClick={() => setInchargeModalOpen(true)} />
                        <InputGroup.Button tabIndex={-1}>
                            <img
                                src={readingGlasses}
                                alt="돋보기"
                                width={20}
                                height={20}
                                style={{ cur: "pointer" }}
                            />
                        </InputGroup.Button>
                    </InputGroup>
                    <Input value={selectedInchargeName || ""} readOnly style={{ width: 250 }} />

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
                        <InputGroup.Addon style={{ width: 80 }}>거래유형</InputGroup.Addon>
                        <InputPicker
                            placeholder="거래유형 선택"
                            data={buyType}
                            style={{ width: 224, border: 'none' }}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </InputGroup>

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
                    onItemSelect={(code, name) => {
                        setSelectedItem(code);
                        setSelectedItemName(name);
                    }}
                />

                <div className="buyBtnBox">
                <Button appearance="ghost" color="green" onClick={handleSearch} className="statusSearchBtn">검색</Button>
                <Button appearance="ghost" color="blie" onClick={downloadExcel} className="statusExcelBtn">엑셀 다운로드</Button>
                </div>

                <Divider style={{ maxWidth: 1400 }} />

                <Table height={400} width={1400} data={orderstatus} onRowClick={itemData => console.log(itemData)}>
                    <Column width={150}><HeaderCell style={styles}>발주일자</HeaderCell><Cell dataKey="order_date" /></Column>
                    <Column width={150}><HeaderCell style={styles}>발주번호</HeaderCell><Cell dataKey="order_id" /></Column>
                    <Column width={150}><HeaderCell style={styles}>거래처명</HeaderCell><Cell dataKey="client_name" /></Column>
                    <Column width={200}><HeaderCell style={styles}>품목명</HeaderCell><Cell dataKey="item_name" /></Column>
                    <Column width={150}><HeaderCell style={styles}>수량</HeaderCell><Cell dataKey="quantity" /></Column>
                    <Column width={150}><HeaderCell style={styles}>단가</HeaderCell><Cell dataKey="price" /></Column>
                    <Column width={150}><HeaderCell style={styles}>공급가액</HeaderCell><Cell dataKey="supply" /></Column>
                    <Column width={150}><HeaderCell style={styles}>부가세</HeaderCell><Cell dataKey="vat" /></Column>
                    <Column width={150}><HeaderCell style={styles}>금액합계</HeaderCell><Cell dataKey="total" /></Column>
                </Table>
            </>
        </Container>
    );
};
