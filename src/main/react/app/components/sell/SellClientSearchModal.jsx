import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input, Container, Placeholder, Loader } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";

const { Column, HeaderCell, Cell } = Table;

// SellClientSearchModal => 거래처 검색 모달 페이지

const SellClientSearchModal = ({ onClientSelect, handleOpen, handleClose } /* = props:속성 */) => {
	
	const fetchURL = AppConfig.fetch['mytest'];
	const [isLoading, setIsLoading] = useState(true);	// 로딩중일때
	const [clientList, setClientList] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [selectedClient, setSelectedClient] = useState(null);

	const handleCheckboxChange = (checked, client) => {
		if (checked) {
			setSelectedClient(client); // 체크된 클라이언트 저장
		} else {
			setSelectedClient(null); // 체크 해제 시 초기화
		}
	};

	// 데이터 조회
	const handleSearch = (keyword) => {
		console.log("키워드: ", keyword);
		if (keyword.trim() === "") { 	// 빈 검색어면 전체 리스트 불러오기
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchClient`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setClientList(res);
				setIsLoading(false);
			});
		} else {	// 키워드로 검색 요청
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchDetailClient/${keyword}`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setClientList(res);
				setIsLoading(false);
			});
		}
	}

	// 선택 완료 처리
	const handleSubmit = () => {
		if (selectedClient) {
			onClientSelect(selectedClient.client_code, selectedClient.client_name);
			handleClose();
		}
	};

	// 모달이 열릴 때 선택값 초기화 + 전체 리스트 불러오기
	useEffect(() => {
		if (handleOpen) {
			setSelectedClient(null);
			setKeyword("");
			
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchClient`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setClientList(res);
				setIsLoading(false);
			});
		}
	}, [handleOpen]);

	return (
		<Modal open={handleOpen} onClose={handleClose} 
			   style={{ width: 400, margin: 'auto', position: 'fixed', left: '40%' }} >

			<Modal.Header>
				<Modal.Title>거래처 선택</Modal.Title>
			</Modal.Header>

			<Modal.Body style={{ overflowX: 'hidden' }}>
				<InputGroup>
					<InputGroup.Addon style={{ width: 90 }}>
						검색어
					</InputGroup.Addon>
					<Input style={{ width: 150 }}
						placeholder='찾는 거래처를 입력하세요'
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
				
				{/* 로딩 중일 때 */}
				{isLoading ? (
					<Container>
						<Placeholder.Paragraph rows={16} />
						<Loader center content="불러오는중..." />
					</Container>
				) : (
				<Table height={400} data={clientList} >
					<Column width={50} align="center" fixed>
						<HeaderCell>선택</HeaderCell>
						<Cell>{(rowData) => (
							<Checkbox 
								checked={selectedClient?.client_code === rowData.client_code} 
								onChange={(_, checked) => 
									handleCheckboxChange(checked, rowData)}
							/>
							)}
						</Cell>
					</Column>

					<Column width={100} align="center" fixed>
						<HeaderCell>거래처 코드</HeaderCell>
						<Cell>{(rowData) => rowData.client_code}</Cell>
					</Column>

					<Column width={150}>
						<HeaderCell>거래처명</HeaderCell>
						<Cell>{(rowData) => rowData.client_name}</Cell>
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


export default SellClientSearchModal;
