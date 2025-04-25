import { Table, Button, Tabs, Message, ButtonToolbar } from 'rsuite';
import React, { useState,  useEffect } from "react";
import SellSearchModal from '#components/sell/SellSearchModal';
import AppConfig from "#config/AppConfig.json";
import "#styles/sell.css";
import "#styles/common.css";
import MessageBox from '../components/common/MessageBox';

// sell_search_item => 판매 물품 검색 페이지

const { Column, HeaderCell, Cell } = Table;

const sell_search_item = () => {
	
	const [itemList, setItemList] = useState([]);	// 전체 리스트
	const [searchResultList, setSearchResultList] = useState(null); // 검색 모달창에서 가져온 결과 리스트
	const fetchURL = AppConfig.fetch['mytest'];

	// 물품 검색 모달 관리
	const [isSearchModalOpen, setSearchModalOpen] = useState(false);

	const handleOpenSearchModal = () => {
		setSearchModalOpen(true);
	};

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

	const styles = {
        backgroundColor: '#f8f9fa',
    };

	return (
		<div> 
			<MessageBox type="warning" text="판매 물품 검색"/>

			<Tabs defaultActiveKey="1" className="search_title">
				<Tabs.Tab eventKey="1" title="전체" />
			</Tabs>

			{/* 검색 설정한 결과 값이 null이 아니고, 아예 없으면 '결과 없음' */}
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
				// 검색 결과 값이 있으면 해당 데이터 보여주고, 없으면 전체 목록 보여주기
			>	
			
			<Column width={100} className="text_center">
				<HeaderCell style={styles}>품목코드</HeaderCell>
				<Cell>{(rowData) => rowData.item_code}</Cell>
			</Column>

			<Column width={150}>
				<HeaderCell  style={styles} className="text_center">품목명</HeaderCell>
				<Cell className="text_left">{(rowData) => rowData.item_name}</Cell>
			</Column>

			<Column width={250}>
				<HeaderCell style={styles} className="text_center">규격</HeaderCell>
				<Cell className="text_left">{(rowData) => rowData.item_standard}</Cell>
			</Column>

			<Column width={150} className="text_center">
				<HeaderCell style={styles}>창고명</HeaderCell>
				<Cell>{(rowData) => rowData.storage_name}</Cell>
			</Column>

			<Column width={100} className="text_center">
				<HeaderCell style={styles}>창고수량</HeaderCell>
				<Cell>{(rowData) => rowData.stock_amount}</Cell>
			</Column>

			<Column width={200} className="text_center">
				<HeaderCell style={styles}>등록일자</HeaderCell>
				<Cell>{(rowData) => rowData.item_reg_date}</Cell>
			</Column>
			
			</Table> 
			)}

			<div className="search_btn">
				<ButtonToolbar>
					<Button color="green" appearance="ghost" onClick={handleOpenSearchModal}>물품 검색</Button>
					<Button appearance="ghost" onClick={resetBtn}>초기화</Button>
				</ButtonToolbar>
			</div>
			
			<SellSearchModal
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
