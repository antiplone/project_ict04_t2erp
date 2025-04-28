import React, { useState, useEffect, useMemo } from 'react';
import readingGlasses from "#images/common/readingGlasses.png";
import { Link } from "@remix-run/react";
import { Button, Container, DateRangePicker, Input, InputGroup,/* Message,  Form, */ Table } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";
import InchargeSearchModal from "#components/logis/InchargeSearchModal.jsx";
import ClientSearchModal from "#components/logis/ClientSearchModal.jsx";
import StorageSearchModal from "#components/logis/StorageSearchModal.jsx";
import MessageBox from '#components/common/MessageBox';
import { useToast } from '#components/common/ToastProvider';//
{/* 판매 추이 차트 */}
import DBChartModal from '#components/chart/DBChartModal.jsx'; // 

const OutgoingList = () => {
	const fetchURL = Appconfig.fetch['mytest']
    const [loading, setLoading] = useState(true); // 로딩 상태를 true로 초기화
	const [salesList, setSalesList] = useState([]); // 초기값을 모르므로 빈배열로 OutgoingList에 대입
	const [salesDate, setSalesDate] = useState(null);
	const [selectedClient, setSelectedClient] = useState(null);
	const [selectedClientName, setSelectedClientName] = useState(null);
	const [isClientModalOpen, setClientModalOpen] = useState(false);
	const [selectedIncharge, setSelectedIncharge] = useState(null);
	const [selectedInchargeName, setSelectedInchargeName] = useState(null);
	const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [selectedStorageName, setSelectedStorageName] = useState(null);
	const [isStorageModalOpen, setStorageModalOpen] = useState(false);
    const { showToast } = useToast(); 
	/* 차트 보기 모달 버튼 */
	const [isChartModalOpen, setChartModalOpen] = useState(false);
	
    const fetchOrders = async () => {
        setLoading(true);
        try {
			const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/logissales/logisSalesList`, { // 스프링부트에 요청한다.
			method: "GET"
            });
            const orderjson = await res.json();
            setSalesList(Array.isArray(orderjson) ? orderjson : []);
        } catch (error) {
			console.error("logisSalesList : ", error);
            setSalesList([]);
            showToast("데이터를 가져오는 중 오류가 발생했습니다.", "error");
        } finally {
            setLoading(false);
        }
    };
	
	// // fetch()를 통해 서버에게 데이터를 요청
	useEffect(() => {  // 통신 시작 하겠다.
		fetchOrders();  // 초기 데이터를 가져옵니다.
	}, []);

	const salesListWithRowNum = salesList.map((sales, index) => ({
		...sales,
		row_num: index + 1, // 1부터 시작하는 번호 부여
	}));

	// 각 주문에 대한 아이템 데이터 가져오기
	useEffect(() => {
		if (salesList.length > 0) {
			const fetchItemsForOrders = async () => {
				setLoading(true); // 로딩 시작
				const updatedOrders = await Promise.all(
					salesList.map(async (sales) => {
						try {
							const res = await fetch(
								`${fetchURL.protocol}${fetchURL.url}/logissales/salesDetail/${sales.order_id}`
							);
							const data = await res.json();
							return { ...sales, itemDataList: data }; // 아이템 데이터 추가
						} catch (err) {
							console.error(err);
							return { ...sales, itemDataList: [] };
						}
					})
				);

				setSalesList(updatedOrders); // 아이템까지 포함된 setSalesList 업데이트
				setLoading(false); // 로딩 완료
			};

			fetchItemsForOrders(); // 아이템 데이터 가져오기
		}
	}, [salesList.length]); // salesList 변경될 때마다 실행 (length로 조건 걸기)

	// 날짜 선택
	const handleDateChange = (value) => {
		console.log("선택된 날짜 범위:", value); // [startDate, endDate]
		setSalesDate(value);
	};


    /* 검색 조건*/
	const handleSearch = async () => {
		setLoading(true);
		let startDate = '';
		let endDate = '';

		if (salesDate && salesDate.length === 2) {
			startDate = salesDate[0].toLocaleDateString('sv-SE');
			endDate = salesDate[1].toLocaleDateString('sv-SE');
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
			Object.entries(searchParams).filter(([_, value]) => value !== null && value !== '' && value !== 'null')
		);

		const query = new URLSearchParams(cleanedParams).toString();

		try {
			const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/logissales/logisSalesSearch?${query}`);
			const result = await res.json();
			setSalesList(result.length ? result : []);
			if (result.length === 0) showToast("선택한 조건에 해당하는 판매정보가 없습니다.", "info");
		} catch (err) {
			console.error("검색 실패:", err);
			setSalesList([]);
		}
	};


	return (
		<div>
			<Container >
				<MessageBox type="info" text="금일 출고 목록"/>
				<div className='main_table'>
					<div className="inputBox">
						<div>
							<InputGroup className="input_date_type">
								<InputGroup.Addon style={{ width: 80 }} className='text_center'>발주일자</InputGroup.Addon>
								<DateRangePicker
									value={salesDate}
									onChange={handleDateChange}
									placeholder="날짜 선택"
									format="yyyy-MM-dd"
								/>
							</InputGroup>
						</div>
						<div className="input">
	                        <InputGroup className="inputModal">
	                            <InputGroup.Addon style={{ width: 80 }} className='text_center'>담당자</InputGroup.Addon>
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
	                        <Input value={selectedInchargeName || ""} readOnly className="inputModalSide" />
	                    </div>
						 <div className="input">
	                        <InputGroup className="inputModal">
	                            <InputGroup.Addon style={{ width: 80 }} className='text_center'>거래처</InputGroup.Addon>
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
	
						<div className="input">
	                        <InputGroup className="inputModal">
	                            <InputGroup.Addon style={{ width: 80 }} className='text_center'>입고창고</InputGroup.Addon>
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
	
						<ClientSearchModal handleOpen={isClientModalOpen} handleColse={() => setClientModalOpen(false)} onClientSelect={(code, name) => { setSelectedClient(code); setSelectedClientName(name); }} />
						<InchargeSearchModal handleOpen={isInchargeModalOpen} handleColse={() => setInchargeModalOpen(false)} onInchargeSelect={(id, name) => { setSelectedIncharge(id); setSelectedInchargeName(name); }} />
						<StorageSearchModal handleOpen={isStorageModalOpen} handleColse={() => setStorageModalOpen(false)} onStorageSelect={(code, name) => { setSelectedStorage(code); setSelectedStorageName(name); }} />
	
					</div>
					<div className="buyBtnBox BtnBoxLeftMargin">
						<Button appearance="primary" onClick={handleSearch}>
							검색
						</Button>
					</div>
	                <br />
					<Table height={400} data={salesListWithRowNum} className="text_center">
						<Table.Column width={80} align="center" fixed>
							<Table.HeaderCell className='text_center'>번호</Table.HeaderCell>
							<Table.Cell dataKey="row_num" />
						</Table.Column>
	
						<Table.Column width={80} align="center" fixed>
							<Table.HeaderCell className='text_center'>주문고유번호</Table.HeaderCell>
							<Table.Cell dataKey="order_id" />
						</Table.Column>
	
						<Table.Column width={120}>
							<Table.HeaderCell className='text_center'>출고일자</Table.HeaderCell>
							<Table.Cell dataKey="shipment_order_date" />
						</Table.Column>
	
						<Table.Column width={240}>
							<Table.HeaderCell className='text_center'>아이템 비고</Table.HeaderCell>
							<Table.Cell dataKey="item_name">
								 {rowData => {
								    const items = useMemo(() => rowData.itemDataList || [], [rowData.itemDataList]);
								    const firstItem = items.length > 0 ? items[0].item_name : "";
								    const totalCount = items.length -1 > 0  ? `외 ${items.length -1} 건` : ""; 
                                    return (
                                        <div>
											{firstItem} {items.length > 0 ? `${totalCount}` : ""}
                                        </div>
                                    );
                                }}
							</Table.Cell>
						</Table.Column>
						
						<Table.Column width={120}>
							<Table.HeaderCell className="text_center">주문상세</Table.HeaderCell>
							<Table.Cell dataKey="item_name" style={{ padding: '6px' }}>
                                {rowData => {
                                    return (
										<Link to={`/main/logis-sales-item-list/${rowData.order_id}`} className="btn btn-primary area_fit wide_fit">
											보기
										</Link>
                                    );
                                }}
                            </Table.Cell>
						</Table.Column>
	
						<Table.Column width={120}>
							<Table.HeaderCell className='text_center'>발주처</Table.HeaderCell>
							<Table.Cell dataKey="client_name" />
						</Table.Column>
	
						{/* <Table.Column width={120}>
	                            <Table.HeaderCell>발주일</Table.HeaderCell>
	                            <Table.Cell dataKey="order_date" />
	                        </Table.Column> */}
	
						<Table.Column width={160}>
							<Table.HeaderCell className='text_center'>입고창고</Table.HeaderCell>
							<Table.Cell dataKey="storage_name" />
						</Table.Column>
					</Table>
					<div>
						<Button appearance="primary" onClick={() => setChartModalOpen(true)}>
							차트 보기
						</Button>
	
						<DBChartModal
							open={isChartModalOpen}
							onClose={() => setChartModalOpen(false)}
						/>
					</div>
				</div>
			</Container>
		</div>
	);
}

export default OutgoingList;