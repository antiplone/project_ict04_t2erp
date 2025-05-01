// 구매팀 - 입고현황 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import { ButtonToolbar, DateRangePicker, Input, InputGroup, Loader, Placeholder, Table } from 'rsuite';
import React, { useState, useEffect } from "react";
import "../styles/buy.css";
import { Button, Container, Divider, Message } from "rsuite";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import ItemSearchModal from "#components/buy/ItemSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";
import { useToast } from '#components/common/ToastProvider';
import MessageBox from '../components/common/MessageBox';

export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매관리 - 입고조회` },
        { name: "description", content: "구매관리에서 입고조회하는 페이지 입니다." },
    ];
};

const { Column, HeaderCell, Cell } = Table;

export default function BuyStockStatus() {

    const fetchURL = AppConfig.fetch['mytest'];
    const [loading, setLoading] = useState(true); // 페이지 로딩중
    const [stockStatusAllList, setStockStatusAllList] = useState([]); // 전체 목록

    const { showToast } = useToast();

    // 발주 일자
    const [orderDate, setOrderDate] = useState(null);

    // 날짜 선택
    const dateChange = (value) => {
        //console.log("선택된 날짜 범위:", value); // [startDate, endDate]
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

    // 발주번호 검색
    const [searchKeyword, setSearchKeyword] = useState("");

    // 날짜 별로 순번 붙이기 (동일한 날짜+동일 주문건이면 동일한 No.)
    const getNumberedList = (data) => {
        const result = [];
        const dateOrderMap = {}; // 날짜별로 order_id 별 순번을 추적
        const dateCountMap = {}; // 날짜별 번호 증가용
    
        // 먼저 날짜 오름차순, 그 안에서 order_id 오름차순으로 정렬
        const sortedData = [...data].sort((a, b) => {
            if (a.order_date < b.order_date) return -1;
            if (a.order_date > b.order_date) return 1;
            if (a.order_id < b.order_id) return -1;
            if (a.order_id > b.order_id) return 1;
            return 0;
        });
    
        sortedData.forEach(item => {
            const date = item.order_date;
            const orderId = item.order_id;
    
            if (!dateOrderMap[date]) {
                dateOrderMap[date] = {};
                dateCountMap[date] = 1;
            }
    
            if (dateOrderMap[date][orderId] === undefined) {
                dateOrderMap[date][orderId] = dateCountMap[date]++;
            }
    
            result.push({
                ...item,
                display_date: `${date}_${dateOrderMap[date][orderId]}`
            });
        });
    
        return result;
    };

    // 전체 리스트 조회
    useEffect(() => {
        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/stockStatusAllList`, {
            method: "GET"
        })
            .then(res => res.json() // 응답이 오면 javascript object로 바꿈.
            )
            .then(res => {
                //console.log(1, res);
                //console.log("데이터 확인", res[0]);
                const numbered = getNumberedList(res);
                setStockStatusAllList(numbered);
                setLoading(false);  // 로딩완료
            }
            )
            .catch(error => {
                //console.error("데이터 가져오기 오류:", error);
                setLoading(false);  // 실패해도 로딩 종료 처리
            });
    }, []);

     // 검색한 리스트 조회하기 : 검색값을 백엔드로 전달
    const [searchResultList, setSearchResultList] = useState([]);

    const [searched, setSearched] = useState(false);    

    // 검색 결과 조회
    const statusSearch = async () => {

        setLoading(true); // 검색할때 로딩중 메시지 true

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
            Object.entries(searchParams).filter(([_, value]) => 
                value !== null && value !== '' && value !== 'null' && value !== 'undefined'
            )
        );

        // URL 쿼리 생성
        const query = new URLSearchParams(cleanedParams).toString();

        try {
            const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/stockStatusSearch?${query}`);
            const result = await res.json();
            //console.log("buyStockStatus:", result);

            if (result.length === 0) {
                showToast("선택한 조건에 해당하는 입고정보가 없습니다.", "warning");
            }
            const searchNumbered = getNumberedList(result);
            setSearchResultList(searchNumbered);

            setSearched(true); 
            setLoading(false); // 로딩완료
        } catch (err) {
            //console.error("검색 실패:", err);
            setSearched(false); // 실패 시 false
            setLoading(false);  // 실패해도 로딩 종료 처리
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

        window.open(`${fetchURL.protocol}${fetchURL.url}/buy/exportStockStatusExcel?${query}`, "_blank");
    };

    // 초기화 버튼 (전체 리스트로 돌아가기)
    const statusList_btn = () => {
        setSearchResultList([]);
        setSearched(false); // 검색 상태 해제
    }

    // 검색 필터 초기화
    const submitStatusReset = () => {
        setOrderDate(null);
        setSelectedClient(null);
        setSelectedClientName(null);
        setSelectedStorage(null);
        setSelectedStorageName(null);
        setSelectedItem(null);
        setSelectedItemName(null);
        setSearchKeyword(null);
        setSearchResultList([]);
        setSearched(false);
    }

    return (
        <>
            <Container>
                <MessageBox type="info" text="입고현황" />
                <br />

                <div className="inputBox">
                    <div className="input">
                        <InputGroup className="input_date_type">
                            <InputGroup.Addon style={{ width: 90 }}>발주일자</InputGroup.Addon>
                            <DateRangePicker
                                value={orderDate}
                                onChange={dateChange}
                                placeholder="날짜 선택"
                                format="yyyy-MM-dd"
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
                                    style={{ cur: "pointer" }}
                                />
                            </InputGroup.Addon>
                        </InputGroup>
                        <Input value={selectedStorageName || ""} readOnly className="inputModalSide" />
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
                                    style={{ cur: "pointer" }}
                                />
                            </InputGroup.Addon>
                        </InputGroup>
                        <Input value={selectedClientName || ""} readOnly className="inputModalSide" />
                    </div>
                </div>

                <div className="inputBox">

                    <div className="input">
                        <InputGroup className="input_date_type">
                            <InputGroup.Addon style={{ width: 90 }}>발주번호</InputGroup.Addon>
                            <Input
                                placeholder="발주번호 입력"
                                value={searchKeyword}
                                onChange={setSearchKeyword}
                            />
                        </InputGroup>
                    </div>

                    <div className="input">
                        <InputGroup className="inputModal">
                            <InputGroup.Addon style={{ width: 90 }}> 품목코드</InputGroup.Addon>
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
                        <Input value={selectedItemName || ""} readOnly className="inputModalSide" />
                    </div>
                </div>

                <div className="buyBtnBox">
                    <Button appearance="ghost" color="green" onClick={statusSearch}>검색</Button>
                    <Button appearance="ghost" type="submit" onClick={submitStatusReset}>검색창 초기화</Button>
                    <Button appearance="ghost" color="violet" onClick={downloadExcel}>엑셀 다운로드</Button>
                </div>

                <Divider />
                <>
                    {/* 로딩 중일 때 */}
                    {loading ? (
                        <Container>
                            <Placeholder.Paragraph rows={12} />
                            <Loader center content="불러오는중..." />
                        </Container>
                        ) : searched && searchResultList.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                            해당 정보로 조회되는 리스트가 없습니다.
                        </div>
                    ) : (
                    <Table height={400} data={searched ? searchResultList : stockStatusAllList}>

                        <Column width={200} className='text_center'>
                            <HeaderCell className='text_center'>발주일자</HeaderCell>
                            <Cell dataKey="display_date" />
                        </Column>

                        <Column width={200} className='text_center'>
                            <HeaderCell className='text_center'>발주번호</HeaderCell>
                            <Cell dataKey="order_id" />
                        </Column>

                        <Column width={250} className='text_left'>
                            <HeaderCell className='text_center'>거래처명</HeaderCell>
                            <Cell dataKey="client_name" />
                        </Column>

                        <Column width={300} className='text_left'>
                            <HeaderCell className='text_center'>물품명</HeaderCell>
                            <Cell dataKey="item_name" />
                        </Column>

                        <Column width={250} className='text_left'>
                            <HeaderCell className='text_center'>창고명</HeaderCell>
                            <Cell dataKey="storage_name" />
                        </Column>

                        <Column width={230} className='text_center'>
                            <HeaderCell className='text_center'>창고재고</HeaderCell>
                            <Cell dataKey="stock_amount" />
                        </Column>

                        <Column width={230} className='text_center'>
                            <HeaderCell className='text_center'>안전재고</HeaderCell>
                            <Cell dataKey="safe_stock" />
                        </Column>

                        <Column width={250} className='text_center'>
                            <HeaderCell className='text_center'>최근 입고일</HeaderCell>
                            <Cell dataKey="last_date" />
                        </Column>

                    </Table>
                    )}
                </>

                <div className="buyBtnBox">
                    <ButtonToolbar>
                        <Button appearance="ghost" onClick={statusList_btn}>내역 초기화</Button>
                    </ButtonToolbar>
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

            </Container >

            <Divider />

        </>
    );
};
