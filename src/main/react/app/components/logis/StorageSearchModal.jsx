// 입고 창고 검색 모달
/* eslint-disable react/prop-types */
import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const StorageSearchModal = ({ title = "입고창고 검색",  confirm = "확인", cancel = "취소", onStorageSelect, handleOpen, handleColse } /* = props:속성 */) => {
	
	const [storageList, setStorageList] = useState([]);
	const [selectedStorage, setSelectedStorage] = useState(null);

	const fetchURL = AppConfig.fetch["mytest"];
	
	// fetch()를 통해 톰캣서버에게 데이터를 요청
	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyStorageList`, {
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
		} else {
			onStorageSelect('', '')
		}
		handleColse();
	};

	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>창고 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Table
				height={510}
                data={(storageList ?? []).filter(storage => storage !== null && storage !== undefined)}
			>

				<Column width={100} align="center" fixed >
					<HeaderCell>선택</HeaderCell>
					
					<Cell>{(storageData) => (
						<Checkbox
						checked={selectedStorage?.storage_code === storageData.storage_code} 
                        onChange={(_, checked) => 
							storageChkChange(checked, storageData)}
						/>
						)}
			  		</Cell>
				</Column>

				<Column width={100} align="center" fixed>
					<HeaderCell>창고 코드</HeaderCell>
					<Cell>{(storageData) => storageData.storage_code}</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>창고명</HeaderCell>
					<Cell>{(storageData) => storageData.storage_name}</Cell>
				</Column>

	  		</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleSubmit} appearance="primary">
					{confirm}
				</Button>
				<Button onClick={() => setSelectedStorage(null)} appearance="ghost" color="orange">
					초기화
				</Button>
				<Button onClick={handleColse} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default StorageSearchModal;
