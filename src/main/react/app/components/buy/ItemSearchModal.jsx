// 물품검색 모달 
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const ItemSearchModal = ({ title, confirm, cancel, onItemSelect, handleOpen, handleColse } /* = props:속성 */) => {
	
	const [itemList, setItemList] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	
	// fetch()를 통해 톰캣서버에게 데이터를 요청
	useEffect(() => {
		fetch("http://localhost:8081/buy/buyItemList", {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			setItemList(res);
		});
	}, []);

	const itemChkChange = (checked, item) => {
		if (checked) {
			setSelectedItem(item); // 체크된 창고 저장
		} else {
			setSelectedItem(null); // 체크 해제 시 초기화
		}
	};
	
	// 선택 완료 처리
	const handleSubmit = () => {
		if (selectedItem) {
			onItemSelect(selectedItem.item_code, selectedItem.item_name);
			handleColse();
		}
	};

	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Table
				height={400}
                data={(itemList ?? []).filter(item => item !== null && item !== undefined)}
			>

				<Column width={100} align="center" fixed>
					<HeaderCell>선택</HeaderCell>
					
					<Cell>{(itemData) => (
						<Checkbox
						checked={selectedItem?.item_code === itemData.item_code} 
                        onChange={(_, checked) => 
							itemChkChange(checked, itemData)}
						/>
						)}
			  		</Cell>
				</Column>

				<Column width={100} align="center" fixed>
					<HeaderCell>물품 코드</HeaderCell>
					<Cell>{(itemData) => itemData.item_code}</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>물품명</HeaderCell>
					<Cell>{(itemData) => itemData.item_name}</Cell>
				</Column>

	  		</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleSubmit} appearance="primary">
					{confirm}
				</Button>
				<Button onClick={handleColse} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ItemSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
};

export default ItemSearchModal;
