// 입고 창고 검색 모달
/* eslint-disable react/prop-types */
import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, Input, InputGroup } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const StorageSearchModal = ({ title, confirm, cancel, onStorageSelect, handleOpen, handleColse } /* = props:속성 */) => {

	const [storageList, setStorageList] = useState([]);
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState("");

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
			handleColse();
		}
	};

	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>창고 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<InputGroup style={{ marginBottom: 10 }}>
					<Input
						placeholder="창고명 또는 코드로 검색"
						value={searchKeyword}
						onChange={setSearchKeyword}
					/>
				</InputGroup>
				<Table
					height={400}
					data={storageList.filter(storage =>
					(!searchKeyword ||
						storage.storage_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
						storage.storage_code?.toString().includes(searchKeyword)

					)
					)
					}
				>
					<Column width={100} align="center" fixed>
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
				<Button
					appearance="primary"
					onClick={() => {
						if (selectedStorage) {
							onStorageSelect(selectedStorage.storage_code, selectedStorage.storage_name);
						} else {
							// 선택 안 했을 경우 null 전달
							onStorageSelect(null, null);
						}
						handleColse(); // 모달 닫기
					}}
				>
					{confirm}
				</Button>
				<Button onClick={handleColse} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

StorageSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "입고창고 검색",
	confirm: "확인",
	cancel: "취소",
};

export default StorageSearchModal;
