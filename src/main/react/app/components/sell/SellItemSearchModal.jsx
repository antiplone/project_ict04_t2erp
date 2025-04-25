import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";

const { Column, HeaderCell, Cell } = Table;

// SellItemSearchModal => 아이템 검색 모달 페이지

const SellItemSearchModal = ({ onItemSelect, handleOpen, handleClose } /* = props:속성 */) => {
	
	const fetchURL = AppConfig.fetch['mytest'];

	const [itemList, setItemList] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [selectedItem, setSelectedItem] = useState(null);

	const itemChkChange = (checked, item) => {
		if (checked) {
			setSelectedItem(item); // 체크된 물품 저장
		} else {
			setSelectedItem(null); // 체크 해제 시 초기화
		}
	};
	
	// 키워드 검색 시 데이터 조회
	const handleSearch = (keyword) => {
		console.log("키워드: ", keyword);

		if (keyword.trim() === "") {
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchItem`, {	// 전체 리스트
				method: "GET"
			})
			.then(res => res.json())
			.then(res => setItemList(res));
		} else {
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchDetailItemList/${keyword}`, {	// 키워드 리스트
				method: "GET"
			})
			.then(res => res.json())
			.then(res => setItemList(res));
		}
	}

	// 선택 완료 처리
	const handleSubmit = () => {
		if (selectedItem) {
			onItemSelect(selectedItem.item_code, selectedItem.item_name, selectedItem.item_standard);
			handleClose();
		}
	};

	// 모달이 열릴 때 선택값 초기화 + 전체 리스트 불러오기
	useEffect(() => {
		if (handleOpen) {
			setSelectedItem(null);
			setKeyword("");
			
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchItem`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => setItemList(res));
		}
	}, [handleOpen]);

	return (
		<Modal open={handleOpen} onClose={handleClose}
			style={{ width: 500, margin: 'auto', position: 'fixed', left: '40%' }} >

			<Modal.Header>
				<Modal.Title>물품 선택</Modal.Title>
			</Modal.Header>

			<Modal.Body>
			<InputGroup>
				<InputGroup.Addon style={{ width: 90 }}>
					검색어
				</InputGroup.Addon>
				<Input style={{ width: 150 }}
						name="keyword"
						value={keyword}
						onChange={(value) => setKeyword(value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
							handleSearch(keyword); // 엔터 키 누르면 검색 실행
							}
						}}
				/>
				<InputGroup.Addon tabIndex={-1} onClick={() => handleSearch(keyword)}>
					<img
						src={readingGlasses}
						alt="돋보기"
						width={20}
						height={20}
						style={{ cursor: "pointer "}}
					/>
				</InputGroup.Addon>
			</InputGroup>

			<Table
				height={400}
				data={itemList}
			>

				<Column width={50} align="center" fixed>
					<HeaderCell>선택</HeaderCell>
					
					<Cell>{(rowData) => (
						<Checkbox
						checked={selectedItem?.item_code === rowData.item_code} 
                        onChange={(_, checked) => 
							itemChkChange(checked, rowData)}
						/>
						)}
			  		</Cell>
				</Column>

				<Column width={100} align="center" fixed>
					<HeaderCell>물품코드</HeaderCell>
					
					<Cell>{(rowData) => rowData.item_code}</Cell>
				</Column>

				<Column width={200}>
					<HeaderCell>물품명</HeaderCell>
					<Cell>{(rowData) => rowData.item_name}</Cell>
				</Column>

				<Column width={250}>
					<HeaderCell>규격</HeaderCell>
					<Cell>{(rowData) => rowData.item_standard}</Cell>
				</Column>
	  		</Table>
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={handleSubmit} appearance="primary">확인</Button>
				<Button onClick={handleClose} appearance="subtle">취소</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SellItemSearchModal;
