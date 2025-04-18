import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import "#styles/sell.css";
import readingGlasses from "#images/common/readingGlasses.png";

const { Column, HeaderCell, Cell } = Table;

// SellItemSearchModal_detail => **검색어 입력으로 물품 찾는 모달

const SellItemSearchModal_detail = ({ title, confirm, cancel, onItemSelect, handleOpen, handleClose } /* = props:속성 */) => {

	const [itemDetailList, setItemDetailList] = useState([]);
	const [selectedItemDetail, setSelectedItemDetail] = useState(null);

	const [keyword, setKeyword] = useState("");	// 검색어

	const fetchURL = AppConfig.fetch['mytest'];

	
	// 검색 버튼 클릭 시, fetch()를 통해 톰캣서버에게 데이터를 요청
	const handleSearch = (keyword) => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchDetailItemList/` + keyword, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			setItemDetailList(res);
		});
	}
	// fetch()를 통해 톰캣서버에게 데이터를 요청
	// useEffect(() => {
	// 	fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchDetailItemList/` + keyword, {
	// 		method: "GET"
	// 	})
	// 	.then(res => res.json())
	// 	.then(res => {
	// 		setItemDetailList(res);
	// 	});
	// }, []);

	const itemChkChange = (checked, item) => {
		if (checked) {
			setSelectedItemDetail(item); // 체크된 물품 저장
		} else {
			setSelectedItemDetail(null); // 체크 해제 시 초기화
		}
	};
	
	// 선택 완료 처리
	const handleSubmit = () => {
		if (selectedItemDetail) {
			onItemSelect(selectedItemDetail.item_code, selectedItemDetail.item_name, selectedItemDetail.item_standard);
			handleClose();
		}
	};

	// 모달이 열릴 때 선택값 초기화
	useEffect(() => {
		if (handleOpen) {
			setSelectedItemDetail(null);
		}
	}, [handleOpen]);

	return (
		<Modal open={handleOpen} onClose={handleClose} size="xs">
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>

			<InputGroup>
				<InputGroup.Addon style={{ width: 90 }}>
					검색어
				</InputGroup.Addon>
				<Input style={{ width: 150 }}
					placeholder='찾는 물품을 입력하세요'
					name="keyword"
					value={keyword}
					onChange={e => setKeyword(e.target.value)}
				/>
				<InputGroup.Addon tabIndex={-1}>
					<img
					src={readingGlasses}
					alt="돋보기"
					width={20}
					height={20}
					onClick={handleSearch}
					style={{ cursor: "pointer "}}
					/>
				</InputGroup.Addon>
			</InputGroup>
			<Table
				height={400}
				data={itemDetailList}
			>

				<Column width={100} align="center" fixed>
					<HeaderCell>선택</HeaderCell>
					
					<Cell>{(rowData) => (
						<Checkbox
						checked={selectedItemDetail?.item_code === rowData.item_code} 
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

				<Column width={250}>
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
				<Button onClick={handleSubmit} appearance="primary">
					{confirm}
				</Button>
				<Button onClick={handleClose} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

SellItemSearchModal_detail.defaultProps = {
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
};

export default SellItemSearchModal_detail;
