import { Table, Button, Tabs, Message, ButtonToolbar } from 'rsuite';
import React, { useState,  useEffect } from "react";
import SellSearchModal from '#components/sell/SellSearchModal';
import AppConfig from "#config/AppConfig.json";
import "../components/common/Sell_maintitle.css";

const { Column, HeaderCell, Cell } = Table;

const sell_search_item = () => {
	
	const fetchURL = AppConfig.fetch['mytest'];

	// 물품 검색 모달 관리
	const [isSearchModalOpen, setSearchModalOpen] = useState(false);

	const handleOpenSearchModal = () => {
		setSearchModalOpen(true);
	};

	// 검색 모달창에서 가져온 값 담기 (검색 결과)
	const [searchResultList, setSearchResultList] = useState(null);

	// 전체 리스트 담기 위해 준비
	const [itemList, setItemList] = useState([]);

	// 전체 리스트 가져오기
	useEffect(()=> {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchItemList`, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			console.log(1, res);
			setItemList(res);
		});
	}, []);

	// '초기화' 버튼 : 기존의 전체 리스트 보여짐
	const resetBtn = () => {
		setSearchResultList(null);
	}

	return (
		<div> 
			 <Message type="warning" className="main_title">
      			판매 물품 검색
    		</Message>


			<Tabs defaultActiveKey="1" className="search_title">
				<Tabs.Tab eventKey="1" title="전체" />
			</Tabs>

			{searchResultList !== null && searchResultList.length === 0 ? 
			(
			<div style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
				검색 결과가 없습니다.
			</div>
			) : (
			<Table 
				className="search_table"
				height={400}
				margin='0 auto'
				data={searchResultList === null
					? itemList
					: searchResultList}
				// 검색 결과가 있으면 해당 데이터 보여주고, 없으면 전체 목록 보여주기
			>	
			
			{/* <Column width={50} className="search_text">
				<HeaderCell><Checkbox className="search_checkbox_all"  /></HeaderCell>
				<Cell><Checkbox className="search_checkbox" /></Cell>
			</Column> */}

			<Column width={100} className="search_text">
				<HeaderCell>품목코드</HeaderCell>
				<Cell>
					{(rowData) => rowData.item_code}
				</Cell>
			</Column>

			<Column width={150} className="search_text">
				<HeaderCell>품목명</HeaderCell>
				<Cell>
					{(rowData) => rowData.item_name}
				</Cell>
			</Column>

			<Column width={300} className="search_text">
				<HeaderCell>규격</HeaderCell>
				<Cell>
					{(rowData) => rowData.item_standard}
				</Cell>
			</Column>
			{/* 
			<Column width={100} className="search_text">
				<HeaderCell>단가</HeaderCell>
				<Cell>
					{(rowData) => rowData.price}
				</Cell>
			</Column> */}

			<Column width={150} className="search_text">
				<HeaderCell>창고명</HeaderCell>
				<Cell>
					{(rowData) => rowData.storage_name}
				</Cell>
			</Column>

			<Column width={100} className="search_text">
				<HeaderCell>창고수량</HeaderCell>
				<Cell>
					{(rowData) => rowData.stock_amount}
				</Cell>
			</Column>

			<Column width={200} className="search_text">
				<HeaderCell>등록일자</HeaderCell>
				<Cell>
					{(rowData) => rowData.item_reg_date}
				</Cell>
			</Column>
			
			</Table> 
			)}

			<div className="search_parent">
  				<div className="search_child">
					<ButtonToolbar>
						<Button appearance="primary" onClick={handleOpenSearchModal}>물품 검색</Button>
						<Button appearance="primary" onClick={resetBtn}>초기화</Button>
					</ButtonToolbar>
				</div>
			</div>
			
			<SellSearchModal
				title="물품 상세 검색"
				confirm="확인"
				cancel="취소"
				// onClientSelect={handleClientSelect}	// client_code, client_name 받기
				handleOpen={isSearchModalOpen}
				handleClose={() => setSearchModalOpen(false)}
				onSearchResult={(resultList) => {
				console.log("검색 결과:", resultList);
				setSearchResultList(resultList);
				}}
			/>
		</div>
		
	);
};


export default sell_search_item;
