import React, { useState, useEffect, useMemo } from 'react';
import { Button, Container, DateRangePicker, Input, InputGroup, Message, /* Form, */ Table, Pagination, Divider } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#styles/common.css";
import ItemSearchModal from "#components/logis/ItemSearchModal.jsx";
import ClientSearchModal from "#components/logis/ClientSearchModal.jsx";
import StorageSearchModal from "#components/logis/StorageSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";
import ExcelDownloadButton from '#components/common/ExcelDownloadButton.jsx';

const { Column, HeaderCell, Cell } = Table;

const StockItemsList = () => {
	const fetchURL = Appconfig.fetch['mytest']
	const [logisStockList, setLogisStockList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입

	// // fetch()를 통해 서버에게 데이터를 요청
	useEffect(() => { // 통신 시작 하겠다.
		fetch(`${fetchURL.protocol}${fetchURL.url}/logisstock/logisStockList`, { // 스프링부트에 요청한다.
			method: "GET" // "GET" 방식으로
		}).then(
			res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
		).then(
			res => {
				console.log(1, res); // setWarehousingist를 통해서 뿌려준다.
				setLogisStockList(res);
			}
		).catch(error => {
			console.error("warehousing list:", error);
			setLogisStockList([]); // 오류 시 빈 배열 설정
		});
	}, []);


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
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemName, setSelectedItemName] = useState(null);
	const [isItemModalOpen, setItemModalOpen] = useState(false);
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [selectedStorageName, setSelectedStorageName] = useState(null);
	const [isStorageModalOpen, setStorageModalOpen] = useState(false);

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
			/*client_code: selectedClient,*/
			item_code: selectedItem,
			client_code: selectedClient,
			storage_code: selectedStorage,
		};

		// 빈 값, 널 제거
		const cleanedParams = Object.fromEntries(
			Object.entries(searchParams).filter(([_, value]) => value !== null && value !== '')
		);

		const query = new URLSearchParams(cleanedParams).toString();

		try {
			const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/logisstock/logisStockSearch?${query}`);
			const result = await res.json();
			const validatedResult = Array.isArray(result) ? result : [];
			setLogisStockList(validatedResult);
			if (validatedResult.length === 0) {
				alert("선택한 조건에 해당하는 구매정보가 없습니다.");
			}

		} catch (err) {
			console.error("검색 실패:", err);
			setLogisStockList([]);
		}
	};

	/* 검색 끝*/

	// 컬럼 정리 버튼
	const [sortColumn, setSortColumn] = React.useState();
	const [sortType, setSortType] = React.useState();

	// 재고 목록
	const getData = () => {
		if (sortColumn && sortType) {
			return logisStockList.slice().sort((a, b) => {
				let x = a[sortColumn];
				let y = b[sortColumn];
				if (typeof x === 'string') { x = x.toLowerCase(); };
				if (typeof y === 'string') { y = y.toLowerCase(); };
				if (x < y) { return sortType === 'asc' ? -1 : 1; };
				if (x > y) { return sortType === 'asc' ? 1 : -1; };
				return 0;
			});
		}
		return logisStockList;
	};

	const stockListWithRowNum = useMemo(() => {
		const sorted = getData();
		return sorted.map((stock, index) => ({
			...stock,
			row_num: index + 1,
		}));
	}, [logisStockList, sortColumn, sortType]);


	const handleSortColumn = (sortColumn, sortType) => {
		setTimeout(() => {
			setSortColumn(sortColumn);
			setSortType(sortType);
		}, 500);
	};
	// 컬럼 정리 버튼 끝

	// 페이징


	/* Pagnation */
	const [limit, setLimit] = useState(30); // 한 페이지에 보여줄 데이터 수
	const [currentPage, setPage] = React.useState(1);
	const handleChangeLimit = dataKey => {
		setPage(1);
		setLimit(dataKey);
	};

	const pagedData = useMemo(() => {
		// 데이터를 가져오고 정렬된 결과를 구합니다.
		const sorted = getData();

		// row_num을 추가합니다.
		const stockListWithRowNum = sorted.map((stock, index) => ({
			...stock,
			row_num: index + 1,
		}));

		// 페이징 처리
		const start = (currentPage - 1) * limit;
		const end = start + limit;
		return stockListWithRowNum.slice(start, end);
	}, [logisStockList, sortColumn, sortType, currentPage, limit]);

	/* 엑셀 다운로드 */
/*	const [showDownloadButton, setShowDownloadButton] = useState(false);*/
	
/*	useEffect(() => {
    if (orderDate && selectedItem && selectedClient && selectedStorage) {
      setShowDownloadButton(true);
    } else {
      setShowDownloadButton(false);
    }
  }, [orderDate, selectedItem, selectedClient, selectedStorage]);*/
	
	const handleExcelDownload = () => {
		const params = {
			start_date: orderDate && orderDate.length === 2 ? orderDate[0].toLocaleDateString('sv-SE') : '',
			end_date: orderDate && orderDate.length === 2 ? orderDate[1].toLocaleDateString('sv-SE') : '',
			item_code: selectedItem,
			storage_code: selectedStorage
		};


		const apiPath = '/excel/exportStockStatusExcel';

		// 다운로드를 바로 실행
		window.open(`${Appconfig.fetch.mytest.protocol}${Appconfig.fetch.mytest.url}${apiPath}?${new URLSearchParams(params)}`, '_blank');
	};


	return (
		<div>
			<Container>
				<Message type="warning" className='main_title' style={{ width: 1500 }}>
					<p>재고 목록</p>
				</Message>

				<div className="inputBox">
					<InputGroup className="input" style={{ width: 300 }}>
						<InputGroup.Addon style={{ width: 80 }}>입고 일자</InputGroup.Addon>
						<DateRangePicker
							value={orderDate}
							onChange={handleDateChange}
							format="yyyy-MM-dd"
							placeholder="날짜 선택"
						/>
					</InputGroup>

					<InputGroup className="input" style={{ width: 190 , marginLeft: '140px'}}>
						<InputGroup.Addon style={{ width: 80 }} className='text_center'>품목</InputGroup.Addon>
						<Input value={selectedItem || ""} readOnly onClick={() => setItemModalOpen(true)} />
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
					<Input value={selectedItemName || ""} readOnly style={{ width: 250 }} />

				</div>
				<div className="inputBox">
					<InputGroup className="input" style={{ width: 170 }}>
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
					<Input value={selectedClientName || ""} readOnly style={{ width: 250 }} />
                    <InputGroup className="input" style={{ width: 190 }}>
                        <InputGroup.Addon style={{ width: 80 }} className='text_center'>보관창고</InputGroup.Addon>
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
				</div>

				<ItemSearchModal handleOpen={isItemModalOpen} handleColse={() => setItemModalOpen(false)} onItemSelect={(code, name) => { setSelectedItem(code); setSelectedItemName(name); }} />
				<ClientSearchModal handleOpen={isClientModalOpen} handleColse={() => setClientModalOpen(false)} onClientSelect={(code, name) => { setSelectedClient(code); setSelectedClientName(name); }} />
				<StorageSearchModal handleOpen={isStorageModalOpen} handleColse={() => setStorageModalOpen(false)} onStorageSelect={(code, name) => { setSelectedStorage(code); setSelectedStorageName(name); }} />

				<div className="buyBtnBox">
					<Button appearance="ghost" color="green" onClick={handleSearch} className="statusSearchBtn">검색</Button>
					<Button appearance="ghost" color="blie" onClick={handleExcelDownload} className="statusExcelBtn">
						엑셀 다운로드
					</Button>
				</div>

				<Divider style={{ maxWidth: 1400 }} />

				<Table height={400} data={pagedData} sortColumn={sortColumn} sortType={sortType} onSortColumn={handleSortColumn} className='text_center'>
					<Column width={80} align="center" fixed>
						<HeaderCell>번호</HeaderCell>
						<Cell dataKey="row_num" />
					</Column>

					<Column width={100} align="center" fixed sortable>
						<HeaderCell>품목코드</HeaderCell>
						<Cell dataKey="item_code" />
					</Column>

					<Column width={200}>
						<HeaderCell>품목명</HeaderCell>
						<Cell dataKey="item_name" />
					</Column>

					<Column width={150}>
						<HeaderCell>품목규격</HeaderCell>
						<Cell dataKey="item_standard" />
					</Column>

					<Column width={100}>
						<HeaderCell>현 재고량</HeaderCell>
						<Cell dataKey="stock_amount" >
							{(rowData) => (
								<span
									style={{
										color: rowData.stock_amount < rowData.safe_stock ? 'red' : 'inherit',
										fontWeight: rowData.stock_amount < rowData.safe_stock ? 'bold' : 'normal'
									}}
								>
									{rowData.stock_amount}
								</span>
							)}
						</Cell>
					</Column>

					<Column width={100}>
						<HeaderCell>안전 재고</HeaderCell>
						<Cell dataKey="safe_stock" />
					</Column>

					<Column width={150} fixed sortable>
						<HeaderCell>최근 입고일</HeaderCell>
						<Cell dataKey="last_date" />
					</Column>

					{/*<Table.Column width={150}>
                        <Table.HeaderCell>제조사</Table.HeaderCell>
                        <Table.Cell dataKey="client_name" />
                    </Table.Column>*/}

					<Column width={150}>
						<HeaderCell>보관창고</HeaderCell>
						<Cell dataKey="storage_name" />
					</Column>

					<Column width={100} fixed sortable>
						<HeaderCell>창고코드</HeaderCell>
						<Cell dataKey="storage_code" />
					</Column>
				</Table>


				<Pagination
					prev
					next
					first
					last
					ellipsis
					boundaryLinks
					maxButtons={5}
					size="md"
					layout={['total', '-', 'limit', '|', 'pager', 'skip']}
					total={stockListWithRowNum.length}
					limit={limit}
					limitOptions={[10, 30, 50]}
					activePage={currentPage}
					onChangePage={setPage}
					onChangeLimit={handleChangeLimit}
					style={{ justifyContent: 'center' }}
					className='logis_pagination'
				/>

				<br />

				{/* <Form>
                    {warehousingList.map(warehousing => 
                        <WarehousingItem key={warehousing.item_code} warehousing={warehousing} />
                    )}
                    </Form> */}
			</Container>
		</div>
	)
}

export default StockItemsList;