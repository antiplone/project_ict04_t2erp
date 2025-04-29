import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input, Container, Placeholder, Loader } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";

// 창고 검색 모달 페이지

const { Column, HeaderCell, Cell } = Table;

const SellStorageSearchModal = ({ onStorageSelect, handleOpen, handleClose } /* = props:속성 */) => {
	
	const fetchURL = AppConfig.fetch['mytest'];
	const [isLoading, setIsLoading] = useState(true);	// 로딩중일때
	const [storageList, setStorageList] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [selectedStorage, setSelectedStorage] = useState(null);

	const storageChkChange = (checked, storage) => {
		if (checked) {
			setSelectedStorage(storage); // 체크된 창고 저장
		} else {
			setSelectedStorage(null); // 체크 해제 시 초기화
		}
	};
	
	// 데이터 조회
	const handleSearch = (keyword) => {
		console.log("키워드: ", keyword);
		if (keyword.trim() === "") {
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchStorage`, {	// 전체 리스트
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setStorageList(res)
				setIsLoading(false);
			});
		} else {
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchDetailStorage/${keyword}`, {	// 키워드 리스트
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setStorageList(res)
				setIsLoading(false);
			});
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
			
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchStorage`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setStorageList(res)
				setIsLoading(false);
			});
		}
	}, [handleOpen]);

	return (
		<Modal open={handleOpen} onClose={handleClose}
			style={{ width: 400, margin: 'auto', position: 'fixed', left: '40%' }} >
			<Modal.Header>
				<Modal.Title>창고 선택</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<InputGroup>
					<InputGroup.Addon style={{ width: 90 }}>
						검색어
					</InputGroup.Addon>
					<Input 
						style={{ width: 150 }}
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
							style={{ cursor: "pointer"}}
						/>
					</InputGroup.Addon>
				</InputGroup>
				
				{/* 로딩 중일 때 */}
				{isLoading ? (
					<Container>
						<Placeholder.Paragraph rows={16} />
						<Loader center content="불러오는중..." />
					</Container>
				) : (
				<Table height={400} data={storageList} >
					<Column width={100} align="center" fixed>
						<HeaderCell>선택</HeaderCell>
						{/* ?. : 옵셔널 체이닝 (Optional Chaining). 값이 null이나 undefined가 아니면, 그 다음 속성에 접근하라 */}
						<Cell>
							{(rowData) => (
								<Checkbox
									checked={selectedStorage?.storage_code === rowData.storage_code} 
									onChange={(_, checked) => 
										storageChkChange(checked, rowData)}
								/> )}
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
				)}
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={handleSubmit} appearance="primary">확인</Button>
				<Button onClick={handleClose} appearance="subtle">취소</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SellStorageSearchModal;
