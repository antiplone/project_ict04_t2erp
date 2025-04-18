import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";

// 창고 검색 모달 페이지

const { Column, HeaderCell, Cell } = Table;

const SellStorageSearchModal = ({ title, confirm, cancel, onStorageSelect, handleOpen, handleClose } /* = props:속성 */) => {
	
	const [storageList, setStorageList] = useState([]);
	const [keyword, setKeyword] = useState("");
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
	
	// 키워드 검색 시 데이터 조회
	const handleSearch = (keyword) => {
		console.log("키워드: ", keyword);
		if (keyword.trim() === "") {
			// 빈 검색어면 전체 리스트 다시 불러오기
			
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchStorage`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => setStorageList(res));
		} else {
			// 키워드로 검색 요청
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchDetailStorage/${keyword}`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => setStorageList(res));
		}
	}

	// 선택 완료 처리
	const handleSubmit = () => {
		if (selectedStorage) {
			onStorageSelect(selectedStorage.storage_code, selectedStorage.storage_name);
			handleClose();
		}
	};

	// 모달이 열릴 때 선택값 초기화 + 전체 리스트 불러오기
	useEffect(() => {
		if (handleOpen) {
			setSelectedStorage(null);
			setKeyword("");
			
			// 전체 리스트 다시 불러오기
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchStorage`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => setStorageList(res));
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
						placeholder='찾는 창고를 입력하세요'
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
				<Button onClick={handleClose} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

SellStorageSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "창고 선택",
	confirm: "확인",
	cancel: "취소",
};

export default SellStorageSearchModal;
