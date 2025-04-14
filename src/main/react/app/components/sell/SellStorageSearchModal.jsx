import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";
import AppConfig from "#config/AppConfig.json";

const { Column, HeaderCell, Cell } = Table;

const SellStorageSearchModal = ({ title, confirm, cancel, onStorageSelect, handleOpen, handleColse } /* = props:속성 */) => {
	
	const [storageList, setStorageList] = useState([]);
	const [selectedStorage, setSelectedStorage] = useState(null);
	
	const fetchURL = AppConfig.fetch['mytest'];

	// fetch()를 통해 톰캣서버에게 데이터를 요청
	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchStorage`, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			setStorageList(res);
		});
	}, []);

	const storageChkChange = (checked, storage) => {
		if (checked) {
			setSelectedStorage(storage); // 체크된 창고 저장
		} else {
			setSelectedStorage(null); // 체크 해제 시 초기화
		}
	};
	
	// 선택 완료 처리
	const handleSubmit = () => {
		if (selectedStorage) {
			onStorageSelect(selectedStorage.storage_code, selectedStorage.storage_name);
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
				data={storageList}
			>

				<Column width={100} align="center" fixed>
					<HeaderCell>선택</HeaderCell>
					
					<Cell>{(rowData) => (
						<Checkbox
						checked={selectedStorage?.storage_code === rowData.storage_code} 
                        onChange={(_, checked) => 
							storageChkChange(checked, rowData)}
						/>
						)}
			  		</Cell>
				</Column>

				<Column width={100} align="center" fixed>
					<HeaderCell>창고 코드</HeaderCell>
					<Cell>{(rowData) => rowData.storage_code}</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>창고명</HeaderCell>
					<Cell>{(rowData) => rowData.storage_name}</Cell>
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

SellStorageSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
};

export default SellStorageSearchModal;
