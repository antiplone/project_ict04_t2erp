import React, { useState, useEffect } from 'react';
import SearchIcon from '@rsuite/icons/Search';
import { Link } from "@remix-run/react";
import { Button, Container, DateRangePicker, Input, InputGroup, /*Message,  Form, */ Table } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#styles/common.css";
import InchargeSearchModal from "#components/logis/InchargeSearchModal.jsx";
import ClientSearchModal from "#components/logis/ClientSearchModal.jsx";
import StorageSearchModal from "#components/logis/StorageSearchModal.jsx";
import EmailFormModal from "#components/email/EmailFormModal.jsx";
import MessageBox from '../components/common/MessageBox';

const OrderIncomeList = () => {
    const fetchURL = Appconfig.fetch['mytest']
    const [orderList, setOrderList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입
    
     const [modalOpen, setModalOpen] = useState(false); // modal visibility state
    
    // Handle modal open/close
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        fetch(`${fetchURL.protocol}${fetchURL.url}/logisorder/logisOrderList`, { // 스프링부트에 요청한다.
            method: "GET" // "GET" 방식으로
        }).then(
            res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
        ).then(
            res => {
                console.log(1, res); // setWarehousingist를 통해서 뿌려준다.
                const orderjson = Array.isArray(res) ? res : [];
                setOrderList(orderjson);
            }
        ).catch(error => {
            console.error("logisOrderList : ", error);
            setOrderList([]); // 오류 시 빈 배열 설정
        });
    }, []);

    const orderListWithRowNum = orderList.map((order, index) => ({
        ...order,
        row_num: index + 1, // 1부터 시작하는 번호 부여
    }));
    
	/* 검색 시작*/  
	
    const [orderDate, setOrderDate] = useState(null);

    // 날짜 선택
    const handleDateChange = (value) => {
        console.log("선택된 날짜 범위:", value); // [startDate, endDate]
        setOrderDate(value);
    };
    
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [isClientModalOpen, setClientModalOpen] = useState(false);
    const [selectedIncharge, setSelectedIncharge] = useState(null);
    const [selectedInchargeName, setSelectedInchargeName] = useState(null);
    const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageName, setSelectedStorageName] = useState(null);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);
	/*const [to, setTo] = useState('');
	const [subject, setSubject] = useState('');
	const [body, setBody] = useState('');
	const [message, setMessage] = useState('');*/
    
    /* 검색 조건*/

	const handleSearch = async () => {
		let startDate = '';
		let endDate = '';
		let e_id = '';

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
		};

		// 빈 값, 널 제거
		const cleanedParams = Object.fromEntries(
			Object.entries(searchParams).filter(([_, value]) => value !== null && value !== '')
		);

		const query = new URLSearchParams(cleanedParams).toString();

		try {
			const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/logisorder/logisOrderSearch?${query}`);
			const result = await res.json();
			const validatedResult = Array.isArray(result) ? result : [];
			setOrderList(validatedResult);
			if (validatedResult.length === 0) {
				alert("선택한 조건에 해당하는 구매정보가 없습니다.");
			}

		} catch (err) {
			console.error("검색 실패:", err);
			setOrderList([]);
		}
	};

    return (
        <div>
            <Container >
            	<MessageBox type="success" text="금일 입고 목록" className="main_title"/>
				<div className="inputBox">
					<div>
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>발주일자</InputGroup.Addon>
							<DateRangePicker
								value={orderDate}
								onChange={handleDateChange}
								format="yyyy-MM-dd"
								placeholder="날짜 선택"
							/>
						</InputGroup>
					</div>
					<div className="display_flex">
						<InputGroup className="input">
							<InputGroup.Addon style={{ width: 80 }}>담당자</InputGroup.Addon>
							<Input value={selectedIncharge || ""} readOnly />
							<InputGroup.Button className="cursor_pointer" tabIndex={-1} onClick={() => setInchargeModalOpen(true)} >
								<SearchIcon />
							</InputGroup.Button>
						</InputGroup>
						<Input value={selectedInchargeName || ""} readOnly style={{ width: 150 }} />
					</div>
					<InputGroup className="input">
						<InputGroup.Addon style={{ width: 80 }}>거래처</InputGroup.Addon>
						<Input value={selectedClient || ""} readOnly />
						<InputGroup.Addon className="cursor_pointer" onClick={() => setClientModalOpen(true)} >
							<SearchIcon />
						</InputGroup.Addon>
					</InputGroup>
					<Input value={selectedClientName || ""} readOnly style={{ width: 150 }} />

					<InputGroup className="input">
						<InputGroup.Addon style={{ width: 80 }}>입고창고</InputGroup.Addon>
						<Input value={selectedStorage || ""} readOnly />
						<InputGroup.Addon className="cursor_pointer" onClick={() => setStorageModalOpen(true)} >
							<SearchIcon />
						</InputGroup.Addon>
					</InputGroup>
					<Input value={selectedStorageName || ""} readOnly style={{ width: 150 }} />

					<ClientSearchModal handleOpen={isClientModalOpen} handleColse={() => setClientModalOpen(false)} onClientSelect={(code, name) => { setSelectedClient(code); setSelectedClientName(name); }} />
					<InchargeSearchModal handleOpen={isInchargeModalOpen} handleColse={() => setInchargeModalOpen(false)} onInchargeSelect={(id, name) => { setSelectedIncharge(id); setSelectedInchargeName(name); }} />
					<StorageSearchModal handleOpen={isStorageModalOpen} handleColse={() => setStorageModalOpen(false)} onStorageSelect={(code, name) => { setSelectedStorage(code); setSelectedStorageName(name); }} />

					<Button appearance="primary" onClick={handleSearch}>
						검색
					</Button>
				</div>
                <br />
                <Table height={400} data={orderListWithRowNum} className="text_center">
                    <Table.Column width={80} align="center" fixed>
                        <Table.HeaderCell>번호</Table.HeaderCell>
                        <Table.Cell dataKey="row_num" />
                    </Table.Column>

                    <Table.Column width={80} align="center" fixed>
                        <Table.HeaderCell>주문고유번호</Table.HeaderCell>
                        <Table.Cell dataKey="order_id" />
                    </Table.Column>

                    <Table.Column width={120}>
                        <Table.HeaderCell>입고일자</Table.HeaderCell>
                        <Table.Cell dataKey="delivery_date" />
                    </Table.Column>

                    <Table.Column width={150}>
                        <Table.HeaderCell>아이템 비고</Table.HeaderCell>
                        <Table.Cell dataKey="item_name" style={{ padding: '6px' }}>
							{rowData => (
								<Link to={`/main/logis-order-item-list/${rowData.order_id}`} className="btn btn-primary area_fit wide_fit">
									주문상세보기
								</Link>
							)}
                        </Table.Cell>
                    </Table.Column>

                    <Table.Column width={120}>
                        <Table.HeaderCell>발주처</Table.HeaderCell>
                        <Table.Cell dataKey="client_name" />
                    </Table.Column>

                    {/* <Table.Column width={120}>
                            <Table.HeaderCell>발주일</Table.HeaderCell>
                            <Table.Cell dataKey="order_date" />
                        </Table.Column> */}

                    <Table.Column width={160}>
                        <Table.HeaderCell>입고창고</Table.HeaderCell>
                        <Table.Cell dataKey="storage_name" />
                    </Table.Column>
                </Table>
                      {/* Email Modal */}
				<div width={50} height={50}>
					<Button appearance="primary" onClick={handleOpenModal}>
						이메일 보내기
					</Button>
				</div>

				{/* EmailFormModal Component */}
				<EmailFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
             </Container>
        </div>
    );
}

export default OrderIncomeList;