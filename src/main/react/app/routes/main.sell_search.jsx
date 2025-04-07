import { Table, Button, Tabs, Message, ButtonToolbar } from 'rsuite';
import React, { useState,  useEffect } from "react";
import SellSearchModal from '#components/sell/SellSearchModal';

const { Column, HeaderCell, Cell } = Table;

const SellSearch = () => {
	// 물품 검색 모달 관리

	const [isSearchModalOpen, setSearchModalOpen] = useState(false);

	const handleOpenSearchModal = () => {
		setSearchModalOpen(true);
	};

	const [itemList, setItemList] = useState([]);

	useEffect(()=> {
		fetch("http://localhost:8081/search/sellItemList", {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			console.log(1, res);
			setItemList(res);
		});
	}, []);

	return (
		<div> 
			 <Message type="warning" bordered showIcon className="main_title">
      			판매 물품 검색
    		</Message>


			<Tabs defaultActiveKey="1" className="search_title">
				<Tabs.Tab eventKey="1" title="전체" />
			</Tabs>
	
			<Table className="search_table"
			height={400}
			margin='0 auto'
			data={itemList}
			// data={data}
			// onRowClick={rowData => {
			// 	console.log(rowData);
			//}}
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

			<Column width={200} className="search_text">
				<HeaderCell>규격</HeaderCell>
				<Cell>
					{(rowData) => rowData.item_standard}
				</Cell>
			</Column>

			<Column width={100} className="search_text">
				<HeaderCell>단가</HeaderCell>
				<Cell>
					{(rowData) => rowData.price}
				</Cell>
			</Column>

			<Column width={100} className="search_text">
				<HeaderCell>창고명</HeaderCell>
				<Cell>
					{(rowData) => rowData.storage}
				</Cell>
			</Column>

			<Column width={100} className="search_text">
				<HeaderCell>창고수량</HeaderCell>
				<Cell>
					{(rowData) => rowData.quantity}
				</Cell>
			</Column>

			<Column width={100} className="search_text">
				<HeaderCell>거래처명</HeaderCell>
				<Cell>
					{(rowData) => rowData.client_name}
				</Cell>
			</Column>

			<Column width={200} className="search_text">
				<HeaderCell>등록일자</HeaderCell>
				<Cell>
					{(rowData) => rowData.date}
				</Cell>
			</Column>
			
			{/* <Column width={300} className="search_text">
				<HeaderCell></HeaderCell>
				
				<Cell >
				
					<Button appearance="link" onClick={handleOpen2} className="search_ED">
					Edit
					</Button>

					<Button appearance="link" onClick={() => alert("삭제")} className="search_ED">
					Delete
					</Button>
				
				</Cell> 
			</Column>*/}

			</Table>

			<div className="search_parent">
  				<div className="search_child">
					
					<ButtonToolbar>
						<Button appearance="primary" onClick={handleOpenSearchModal}>물품 검색</Button>
					</ButtonToolbar>
				</div>
			</div>
			
			{/* 판매 물품 검색 모달
			<Modal open={open1} onClose={handleClose1} style={{ width: 700}}>
				<Modal.Header>
				<Modal.Title>판매 물품 찾기</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SellSearchModal /> 
				</Modal.Body>
				<Modal.Footer />
			</Modal> */}

			{/* 판매 수정 모달
			<Modal open={open2} onClose={handleClose2} style={{ width: 1300}}>
				<Modal.Header>
				<Modal.Title>판매 수정</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SellEdit />
				</Modal.Body>
				<Modal.Footer />
			</Modal> */}
			<SellSearchModal
				title="판매 물품 선택"
				confirm="확인"
				cancel="취소"
				// onClientSelect={handleClientSelect}	// client_code, client_name 받기
				handleOpen={isSearchModalOpen}
				handleColse={() => setSearchModalOpen(false)}
			/>
		</div>
		
	);
};


export default SellSearch;
