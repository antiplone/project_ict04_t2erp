import React, { useState, useEffect, useMemo } from 'react';
import { Link } from "@remix-run/react";
import { Button, Container, DateRangePicker, Input, InputGroup, Table, Divider, Loader } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#styles/common.css";
import readingGlasses from "#images/common/readingGlasses.png";
import MessageBox from '#components/common/MessageBox';
import { useToast } from '#components/common/ToastProvider';//

import InchargeSearchModal from "#components/logis/InchargeSearchModal.jsx";
import ClientSearchModal from "#components/logis/ClientSearchModal.jsx";
import StorageSearchModal from "#components/logis/StorageSearchModal.jsx";
{/* 판매 추이 차트 */}
import DBChartModal from '#components/chart/DBChartModal2.jsx'; //

const {Column, HeaderCell, Cell} = Table;

const OrderIncomeList = () => {
    const fetchURL = Appconfig.fetch['mytest']
    const [loading, setLoading] = useState(true); // 로딩 상태를 true로 초기화
    const [orderList, setOrderList] = useState([]); // 초기값을 모르므로 빈배열로 OrderIncomeList에 대입
    const [orderDate, setOrderDate] = useState(null);
    const { showToast } = useToast(); 
  
	/* 차트 보기 모달 버튼 */
	const [isChartModalOpen, setChartModalOpen] = useState(false);
	
	// 담당자 모달  
	const [selectedIncharge, setSelectedIncharge] = useState(null);
	const [selectedInchargeName, setSelectedInchargeName] = useState(null);
	const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);
	
	
	// 거래처 모달  
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [isClientModalOpen, setClientModalOpen] = useState(false);
    
	// 창고 모달
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageName, setSelectedStorageName] = useState(null);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);
    
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/logisorder/logisOrderList`, {
                method: "GET"
            });
            const orderjson = await res.json();
            setOrderList(Array.isArray(orderjson) ? orderjson : []);
        } catch (error) {
            console.error("logisOrderList : ", error);
            setOrderList([]);
            showToast("데이터를 가져오는 중 오류가 발생했습니다.", "error");
        } 
    };

    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => {
        fetchOrders();  // 초기 데이터를 가져옵니다.
    }, []);

    const orderListWithRowNum = orderList.map((order, index) => ({
        ...order,
        row_num: index + 1, // 1부터 시작하는 번호 부여
    }));
    
	// 각 주문에 대한 아이템 데이터 가져오기
	useEffect(() => {
		if (orderList.length > 0) {
			const fetchItemsForOrders = async () => {
				const updatedOrders = await Promise.all(
					orderList.map(async (order) => {
						if (order.itemDataList) return order; // 이미 있으면 skip
						try {
							const res = await fetch(
								`${fetchURL.protocol}${fetchURL.url}/logisorder/orderDetail/${order.order_id}`
							);
							const data = await res.json();
							return { ...order, itemDataList: data }; // 아이템 데이터 추가
						} catch (err) {
							console.error(err);
							return { ...order, itemDataList: [] };
						}
					})
				);
				//itemDataList가 변경된 경우에만 갱신
				const isChanged = updatedOrders.some((updated, index) =>
				JSON.stringify(updated.itemDataList) !== JSON.stringify(orderList[index].itemDataList)
			);
			
			if (isChanged) setOrderList(updatedOrders);
			
			setLoading(false);
			};
			fetchItemsForOrders(); // 아이템 데이터 가져오기
		}
	}, [orderList]); // orderList가 변경될 때마다 실행 (length로 조건 걸기)

    // 날짜 선택
    const handleDateChange = (value) => {
        console.log("선택된 날짜 범위:", value); // [startDate, endDate]
        setOrderDate(value);
    };
    
	// 검색 조건 설정
	const [searchParams, setSearchParams] = useState({
		start_date: '',
		end_date: '',
		client_code: '',
		e_id: '',
		storage_code: '',
	});

    
    /* 검색 조건*/
	const handleSearch = async () => {
		setLoading(true);
		let startDate = '';
		let endDate = '';

		if (orderDate && orderDate.length === 2) {
			startDate = orderDate[0].toLocaleDateString('sv-SE');
			endDate = orderDate[1].toLocaleDateString('sv-SE');
		}
		
		const updatedParams = {
			start_date: startDate,
			end_date: endDate,
			e_id: selectedIncharge || '',
			client_code: selectedClient || '',
			storage_code: selectedStorage || ''
		};
		
		    // 빈 값, 널 제거
	    const cleanedParams = Object.fromEntries(
	        Object.entries(updatedParams).filter(([_, value]) => value !== null && value !== '' && value !== 'null')
	    );

		const query = new URLSearchParams(cleanedParams).toString();

		try {
			const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/logisorder/logisOrderSearch?${query}`);
			const result = await res.json();
			 setOrderList(result.length ? result : []);
            if (result.length === 0) showToast("선택한 조건에 해당하는 구매정보가 없습니다.", "info");
        } catch (err) {
            console.error("검색 실패:", err);
            setOrderList([]);
        }
		setLoading(false);
	};
	
	// 초기화 버튼
	const resetSearch_btn = () => {
		// 검색 조건 초기화
		setOrderDate(null);				// OrderDate도 초기화
	    setSelectedClient('');			// client 선택값 초기화
	    setSelectedClientName('');		// client 이름 선택값 초기화
	    setSelectedIncharge('');		// 담당자 초기화
	    setSelectedInchargeName('');	// 담당자 이름 초기화
	    setSelectedStorage('');			// 창고 초기화
	    setSelectedStorageName('');		// 창고명 초기화

		setSearchParams({
			start_date: '',
			end_date: '',
			client_code: '',
	        e_id: '',
			storage_code: '',
		});
	};

	// 아이템 비고 Cell
	const ItemNameCell = ({ rowData}) => {
		const items = useMemo(() => rowData.itemDataList || [], [rowData.itemDataList]);
		const firstItem = items.length > 0 ? items[0].item_name : "";
		const totalCount = items.length - 1 > 0 ? `외 ${items.length - 1} 건` : "";

		return (
			<div>
				{firstItem} {items.length > 0 ? `${totalCount}` : ""}
			</div>
		);
	};
    return (
        <div>
        	<MessageBox type="success" text="입고 관리"/>
            <Container style={{margin: '0 auto', maxWidth : '1920px'}}>
				<div className='main_table'>
					<div className="inputBox">
						<div className="input">
							<InputGroup className="input_date_type" style={{ width: 350 }}>
								<InputGroup.Addon style={{ width: 80 }}  className='text_center'>입고일자</InputGroup.Addon>
								<DateRangePicker
									value={orderDate}
									onChange={handleDateChange}
									placeholder="날짜 선택"
									format="yyyy-MM-dd"
								/>
							</InputGroup>
						</div>

           				<div className="input">
							<InputGroup className="inputModal">
								<InputGroup.Addon style={{ width: 80 }}>담당자</InputGroup.Addon>
								<Input value={selectedIncharge || ""} readOnly onClick={() => setInchargeModalOpen(true)} />
								<InputGroup.Button tabIndex={-1}>
									<img
										src={readingGlasses}
										alt="돋보기"
										width={20}
										height={20}
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
									/>
								</InputGroup.Addon>
							</InputGroup>
							<Input value={selectedClientName || ""} readOnly className="inputModalSide" />
						</div>
						
						<div className="input">
							<InputGroup className="inputModal">
								<InputGroup.Addon style={{ width: 80 }}>입고창고</InputGroup.Addon>
								<Input value={selectedStorage || ""} readOnly onClick={() => setStorageModalOpen(true)} />
								<InputGroup.Addon>
									<img
										src={readingGlasses}
										alt="돋보기"
										width={20}
										height={20}
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
						<Button color="green" appearance="ghost" onClick={handleSearch}>
							검색
						</Button>
						
						<Button appearance="ghost" onClick={resetSearch_btn}>
							초기화
						</Button>
					</div>
					
					<Divider />
					{loading ? (
						<div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Loader size="md" content="데이터를 불러오는 중입니다..." />
						</div>
						) : (
						<Table width={1920} height={400} data={orderListWithRowNum} className="text_center" loading={loading}>
	
							<Column width={120} align="center" fixed>
								<HeaderCell className='text_center'>번호</HeaderCell>
								<Cell dataKey="row_num" />
							</Column>
	
							<Column width={180} align="center" fixed>
								<HeaderCell className='text_center'>주문고유번호</HeaderCell>
								<Cell dataKey="order_id" />
							</Column>
							
							<Column width={180} align="center" fixed>
								<HeaderCell className='text_center'>담당팀</HeaderCell>
								<Cell dataKey="d_name" />
							</Column>
							
							<Column width={180} align="center" fixed>
								<HeaderCell className='text_center'>담당자</HeaderCell>
								<Cell dataKey="e_name" />
							</Column>
	
							<Column width={200}>
								<HeaderCell className='text_center'>입고일자</HeaderCell>
								<Cell dataKey="delivery_date" />
							</Column>
	
							<Column width={400}>
								<HeaderCell className="text_center">아이템 비고</HeaderCell>
								<Cell dataKey="item_name">
									{rowData => 
										<ItemNameCell rowData={rowData} loading={loading}
									/>}
								</Cell>
							</Column>
							
							<Column width={280}>
								<HeaderCell className="text_center">주문상세</HeaderCell>
								<Cell dataKey="item_name" style={{ padding: '6px' }}>
	                                {rowData => {
	                                    return (
											<Link to={`/main/logis-order-item-list/${rowData.order_id}`} className="btn btn-primary area_fit wide_fit">
												아이템 전체 보기
											</Link>
	                                    );
	                                }}
	                            </Cell>
							</Column>
	
							<Column width={180}>
								<HeaderCell className='text_center'>발주처</HeaderCell>
								<Cell dataKey="client_name" />
							</Column>
	
							<Column width={200}>
								<HeaderCell className='text_center'>입고창고</HeaderCell>
								<Cell dataKey="storage_name" />
							</Column>
						</Table>
					)}
					<div style={{ display: 'flex', margin : '10px' }}>
						
						{/* ChartModal 버튼 */}
						<Button appearance="primary" onClick={() => setChartModalOpen(true)}>
							차트 보기
						</Button>

						{/* ChartModal Component */}
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

export default OrderIncomeList;