import React, { useState, useEffect, useMemo } from 'react';
import { Button, Container, DateRangePicker, Input, InputGroup, Divider, Loader } from 'rsuite';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';

import Appconfig from "#config/AppConfig.json";
import "#styles/common.css";
import ItemSearchModal from "#components/logis/ItemSearchModal.jsx";
import EmailFormModal from "#components/email/EmailFormModal.jsx";
import StorageSearchModal from "#components/logis/StorageSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";
import MessageBox from '#components/common/MessageBox';
import { useToast } from '#components/common/ToastProvider';



const StockItemsList = () => {
	const rawFetchURL = Appconfig.fetch["mytest"];
	const fetchURL = rawFetchURL.protocol + rawFetchURL.url;
	const [logisStockList, setLogisStockList] = useState([]);	// 초기값을 모르므로 빈배열로 logisStockList에 대입
	const [orderDate, setOrderDate] = useState(null);			// 컬럼 정리 버튼
	const [loading, setLoading] = useState(true);			// 컬럼 정리 버튼
	const { showToast } = useToast();

	const [sortColumn, setSortColumn] = React.useState();
	const [sortType, setSortType] = React.useState();
	
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemName, setSelectedItemName] = useState(null);
	const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
	
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [selectedStorageName, setSelectedStorageName] = useState(null);
	const [isStorageModalOpen, setStorageModalOpen] = useState(false);

    // 모달 열기/닫기
	const handleOpenModal = () => {
		resetSearch_btn();      // 검색 조건 초기화 실행
		setModalOpen(true);     // 모달 열기
	};
    const handleCloseModal = () => setModalOpen(false); // 모달 닫기

	// fetch()를 통해 서버에게 데이터를 요청
	useEffect(() => { // 통신 시작 하겠다.
    	setLoading(true)
		fetch(`${fetchURL}/logisstock/logisStockList`, { // 스프링부트에 요청한다.
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
		})
    	setLoading(false)
	}, []);


	/* 검색 시작*/
	// 날짜 선택
	const handleDateChange = (value) => {
		console.log("선택된 날짜 범위:", value); // [startDate, endDate]
		setOrderDate(value);
	};


	// 초기화 버튼
	const resetSearch_btn = () => {
		// 검색 조건 초기화
		setOrderDate(null);          // salesDate도 초기화
		setSelectedItem('');    	 // 품번 초기화
		setSelectedItemName(''); // 품명 초기화
		setSelectedStorage('');      // 창고 초기화
		setSelectedStorageName('');  // 창고명 초기화
	};


	const handleSearch = async () => {
    	setLoading(true)
		let startDate = '';
		let endDate = '';

		if (orderDate && orderDate.length === 2) {
			startDate = orderDate[0].toLocaleDateString('sv-SE');
			endDate = orderDate[1].toLocaleDateString('sv-SE');
		}

		const searchParams = {
			start_date: startDate,
			end_date: endDate,
			item_code: selectedItem,
			storage_code: selectedStorage,
		};

		// 빈 값, 널 제거
		const cleanedParams = Object.fromEntries(
			Object.entries(searchParams).filter(([_, value]) => value !== null && value !== '')
		);

		const query = new URLSearchParams(cleanedParams).toString();

		try {
			const res = await fetch(`${fetchURL}/logisstock/logisStockSearch?${query}`);
			const result = await res.json();
			console.log('검색 결과:', result);
			const validatedResult = Array.isArray(result) ? result : [];
			setLogisStockList(validatedResult);
			if (validatedResult.length === 0) {
				showToast("선택한 조건에 해당하는 구매정보가 없습니다.");
			}

		} catch (err) {
			console.error("검색 실패:", err);
			setLogisStockList([]);
		}
    	setLoading(false)
	};
	/* 검색 끝*/

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

	const handleExcelDownload = () => {
		const params = {
			start_date: orderDate && orderDate.length === 2 ? orderDate[0].toLocaleDateString('sv-SE') : '',
			end_date: orderDate && orderDate.length === 2 ? orderDate[1].toLocaleDateString('sv-SE') : '',
			item_code: selectedItem,
			storage_code: selectedStorage
		};

		const apiPath = '/excel/exportStockStatusExcel';

		// 다운로드를 바로 실행
		window.open(`${fetchURL}${apiPath}?${new URLSearchParams(params)}`, '_blank');
	};

	return (
		<div>
			<MessageBox type="warning" text="재고 관리" />
			<Container style={{ margin: '0 auto', maxWidth: '1920px' }}>
			
				<div className='main_table'>
					<div className="inputBox">
						<div className="input">
							<InputGroup className="input_date_type" style={{ width: 350 }}>
								<InputGroup.Addon style={{ width: 80 }} className='text_center'>입고 일자</InputGroup.Addon>
								<DateRangePicker
									value={orderDate}
									onChange={handleDateChange}
									format="yyyy-MM-dd"
									placeholder="날짜 선택"
								/>
							</InputGroup>
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

						<div className="input">
							<InputGroup className="inputModal">
								<InputGroup.Addon style={{ width: 80 }}> 품목코드</InputGroup.Addon>
								<Input value={selectedItem || ""} readOnly onClick={() => setItemModalOpen(true)} />
								<InputGroup.Addon>
									<img
										src={readingGlasses}
										alt="돋보기"
										width={20}
										height={20}
									/>
								</InputGroup.Addon>
							</InputGroup>
							<Input value={selectedItemName || ""} readOnly style={{ width: 150 }} />
						</div>

						<StorageSearchModal handleOpen={isStorageModalOpen} handleColse={() => setStorageModalOpen(false)} onStorageSelect={(code, name) => { setSelectedStorage(code); setSelectedStorageName(name); }} />
						<ItemSearchModal handleOpen={isItemModalOpen} handleColse={() => setItemModalOpen(false)} onItemSelect={(code, name) => { setSelectedItem(code); setSelectedItemName(name); }} />
					</div>

					<div className="buyBtnBox BtnBoxLeftMargin">
						<Button appearance="ghost" color="green" onClick={handleSearch} className="statusSearchBtn">
							검색
						</Button>
						<Button appearance="ghost" onClick={resetSearch_btn}>
							초기화
						</Button>
						<Button appearance="ghost" color="blie" onClick={handleExcelDownload} className="statusExcelBtn">
							엑셀 다운로드
						</Button>
					</div>

					<Divider />
					{loading ? (
					<div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Loader size="md" content="데이터를 불러오는 중입니다..." />
					</div>
					) : (
					<Table width={1920} height={400} data={stockListWithRowNum} sortColumn={sortColumn} sortType={sortType} onSortColumn={handleSortColumn} className='text_center'>
						<Column width={120} align="center" fixed>
							<HeaderCell className='text_center'>번호</HeaderCell>
							<Cell dataKey="row_num" className='text_center' />
						</Column>

						<Column width={180} align="center" fixed sortable>
							<HeaderCell className='text_center'>품목코드</HeaderCell>
							<Cell dataKey="item_code" className='text_center' />
						</Column>

						<Column width={400}>
							<HeaderCell className='text_center'>품목명</HeaderCell>
							<Cell dataKey="item_name" className='text_center' />
						</Column>

						<Column width={340}>
							<HeaderCell className='text_center'>품목 규격</HeaderCell>
							<Cell dataKey="item_standard" className='text_center' />
						</Column>

						<Column width={180}>
							<HeaderCell className='text_center'>현 재고량</HeaderCell>
							<Cell dataKey="stock_amount" className='text_center'>
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

						<Column width={180}>
							<HeaderCell className='text_center'>안전 재고</HeaderCell>
							<Cell dataKey="safe_stock" className='text_center' />
						</Column>

						<Column width={200} fixed sortable>
							<HeaderCell className='text_center'>최근 입고일</HeaderCell>
							<Cell dataKey="last_date" className='text_center' />
						</Column>

						<Column width={200}>
							<HeaderCell className='text_center'>보관창고</HeaderCell>
							<Cell dataKey="storage_name" className='text_center' />
						</Column>

						<Column width={100} fixed sortable>
							<HeaderCell className='text_center'>창고코드</HeaderCell>
							<Cell dataKey="storage_code" className='text_center' />
						</Column>
					</Table>
					)}
					<br />
					<div style={{ display: 'flex', margin: '10px'}}>
						{/* Email Modal */}
						<div width={50} height={50} style={{ marginRight: '20px'}}>
							<Button appearance="primary" onClick={handleOpenModal}>
								이메일 보내기
							</Button>
						</div>

						{/* EmailFormModal Component */}
						<EmailFormModal open={modalOpen} onClose={() => handleCloseModal(false)}/>
					</div>
				</div>
			
			</Container>
		</div>
	)
}

export default StockItemsList;