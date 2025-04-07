// 구매팀 - 구매현황 조회 페이지
/* eslint-disable react/react-in-jsx-scope */
import { Button, Container, DatePicker, DateRangePicker, Input, InputGroup, InputPicker, Message } from "rsuite"
import SearchIcon from '@rsuite/icons/Search';
import React, { useState } from "react";
import BuyStatusSelectTbl from "#components/buy/BuyStatusSelectTbl";
import "../styles/buy.css";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import { useNavigate } from "@remix-run/react";
import ItemModalForm from "#components/buy/ItemModalForm.jsx";

export function meta() {
    return [
        { title: "구매현황조회" },
        { name: "description", content: "구매현황조회" },
    ];
};

/* 거래유형 - 선택 데이터 */
const buyType = ["부과세율 적용", "부가세율 미적용"].map(
    (item) => ({ 
        label: item, // 사용자에게 보여질 이름
        value: item, // 실제 저장되거나 비교에 쓰이는 값
    })
);

const search = {
    width: 100
}

export default function BuyStatusSelect() {

    const navigate = useNavigate();

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
       
        // 물품목록 모달관리
        const [selectedItem, setSelectedItem] = useState(null);
        const [selectedItemName, setSelectedItemName] = useState(null);
        const [isItemModalOpen, setItemModalOpen] = useState(false);
    
        const handleItemSelect = (Item_code, Item_name) => {
            setSelectedItem(Item_code);
            setSelectedItemName(Item_name);
            setItemModalOpen(false);
        };
    
        const handleOpenItemModal = () => {
            setItemModalOpen(true);
        };

        // 부가세율 적용, 미적용 관리
        const [selectedType, setSelectedType] = useState('');

    return (

        <Container>
            <>
                <Message type="info" style={{ width: 960 }}>
                    <strong>구매현황</strong>
                </Message>
                <br />

                <div className="inputBox" >
                <InputGroup className="input">
                    <InputGroup.Addon style={{ width: 80 }}>
                        일자
                    </InputGroup.Addon>
                    <DatePicker />
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
                        style={{ width: 140, border: 'none', height: 38 }}
                        value={selectedType}
                        onChange={setSelectedType} 
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
                    <Input placeholder='물품입력'
                        value={selectedItem || ""} readOnly
                    />
                   <InputGroup.Addon>
                        <SearchIcon onClick={handleOpenItemModal}/>
                    </InputGroup.Addon>
                </InputGroup>
                <Input type="text" autoComplete="off" style={{ width: 150, marginBottom: 5}}
                    value={selectedItemName || ""} readOnly />
            </div>
            {/* <Uploader action="//jsonplaceholder.typicode.com/posts/">
                    <Button style={{ width: 300, height: 40 }} color="green" appearance="ghost">전표등록</Button>
                </Uploader>     */}

            <InchargeSearchModal
                title="담당자 검색"
                confirm="확인"
                cancel="취소"
                onInchargeSelect={handleInchargeSelect}	// emid, Incharge 받기
                handleOpen={isInchargeModalOpen}
                handleColse={() => setInchargeModalOpen(false)}
            />

            <ClientSearchModal
                title="거래처 검색"
                confirm="확인"
                cancel="취소"
                onClientSelect={handleClientSelect}	// client_code, client_name 받기
                handleOpen={isClientModalOpen}
                handleColse={() => setClientModalOpen(false)}
            />

            <StorageSearchModal
                title="입고창고 검색"
                confirm="확인"
                cancel="취소"
                onStorageSelect={handleStorageSelect}	// storage_code, storage_name 받기
                handleOpen={isStorageModalOpen}
                handleColse={() => setStorageModalOpen(false)}
            />

            <ItemModalForm
                title="물품 검색"
                confirm="확인"
                cancel="취소"
                onItemSelect={handleItemSelect}	// item_code, item_name 받기
                handleOpen={isItemModalOpen}
                handleColse={() => setItemModalOpen(false)}
            />

            <Button appearance="primary" type="submit" style={search}>
                검색
            </Button>
            <hr />

            <BuyStatusSelectTbl />

            </>
        </Container>

    );
};
