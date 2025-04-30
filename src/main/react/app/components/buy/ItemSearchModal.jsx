// 물품검색 모달 
/* eslint-disable react/prop-types */
import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, Container, Placeholder, Loader } from "rsuite";
import { Input, InputGroup } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const ItemSearchModal = ({ title, confirm, cancel, onItemSelect, handleOpen, handleColse } /* = props:속성 */) => {

	const fetchURL = AppConfig.fetch["mytest"];

	const [itemList, setItemList] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState("");

	// fetch()를 통해 톰캣서버에게 데이터를 요청
	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyItemList`, {
			method: "GET"
		})
			.then(res => res.json())
			.then(res => {
				setItemList(res);
			})
			.catch((err) => {
				//console.error("물품 조회 실패:", err);
			});
	}, [handleOpen]);

	const itemChkChange = (checked, item) => {
		if (checked) {
			setSelectedItem(item); // 체크된 창고 저장
		} else {
			setSelectedItem(null); // 체크 해제 시 초기화
		}
	};

	return (
		<>
			<Modal open={handleOpen} onClose={handleColse} size="xs">
				<Modal.Header>
					<Modal.Title>물품 검색</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup style={{ marginBottom: 10 }}>
						<Input
							placeholder="물품명 또는 코드로 검색"
							value={searchKeyword}
							onChange={setSearchKeyword}
						/>
					</InputGroup>

					<Table
						height={400}
						data={itemList.filter(item =>
						(!searchKeyword ||
							item.item_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
							item.item_code?.toString().includes(searchKeyword)
						)
						)}
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
					<Button
						appearance="primary"
						onClick={() => {
							if (selectedItem) {
								onItemSelect(selectedItem.item_code, selectedItem.item_name);
							} else {
								// 선택 안 했을 경우 null 전달
								onItemSelect(null, null);
							}
							handleColse(); // 모달 닫기
						}}
					>
						확인
					</Button>
					<Button onClick={handleColse} appearance="subtle">
						취소
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ItemSearchModal;
