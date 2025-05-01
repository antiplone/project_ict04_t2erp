import React, { useState, useEffect } from "react";
import { Button, Modal, Form, InputGroup, AutoComplete, HStack, Input } from "rsuite";
import StorageSearchModal from "./SellStorageSearchModal";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";
import SellItemSearchModal from "./SellItemSearchModal";

// SellSearchModal => 판매 물품 검색 > 물품, 창고 검색 가능한 모달 페이지

const SellSearchModal = ({ handleOpen, handleClose, onSearchResult } /* = props:속성 */) => {
	
	const fetchURL = AppConfig.fetch['mytest'];
	const [searchResultList, setSearchResultList] = useState([]);	// 조회한 결과 리스트
	
	// 물품 모달 관리
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemName, setSelectedItemName] = useState(null);
	const [isItemModalOpen, setItemModalOpen] = useState(false);

	const handleItemSelect = (emid, incharge) => {
		setSelectedItem(emid);
		setSelectedItemName(incharge);
		setItemModalOpen(false);
	};

	// 창고 모달 관리
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [selectedStorageName, setSelectedStorageName] = useState(null);
	const [isStorageModalOpen, setStorageModalOpen] = useState(false);

	const handleStorageSelect = (emid, incharge) => {
		setSelectedStorage(emid);
		setSelectedStorageName(incharge);
		setStorageModalOpen(false);
	};


	// 입력한 값을 백엔드로 전달
	const submitSellSearch = (e) => {
		e.preventDefault();
		
		const payload = {
			item_code: selectedItem,
			storage_name: selectedStorageName,
		};
	
		// console.log("제출할 전체 데이터:", payload); // 확인용
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchResultItemList`, {
			method: "POST",		// 데이터를 Body에 JSON으로 넣어서 보냄(보통 조회 시 GET 사용하나, 넘길 값이 많거나 URL보안 필요 시 POST도 사용)
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),	// 선택한 값(아이템코드, 창고명) 담아 넘기기
		})
		.then((res) => res.json())
		.then((data) => {
			// console.log("검색 결과:", data);
			setSearchResultList(data);
				if (onSearchResult) {
					onSearchResult(data); // 부모에게 전달
				}
			handleClose(); // 모달 닫기 추가!!
		})
		.catch((error) => {
			// console.error("검색 오류:", error);
		});
	};

	// 모달이 열릴 때 선택값 초기화
	useEffect(() => {
		if (handleOpen) {
			setSelectedItem(null);
			setSelectedItemName(null);
			setSelectedStorage(null);
			setSelectedStorageName(null);
		}
	}, [handleOpen]);

	return (
		<Modal open={handleOpen} onClose={handleClose}>
			<Modal.Header>
				<Modal.Title>물품 검색</Modal.Title>
			</Modal.Header>
			{/* overflowX: 'hidden' => 가로 스크롤 없애기 (넘치는 영역 제거) */}
			<Modal.Body style={{ overflowX: 'hidden' }}>
			<Form className="addForm" layout="inline">

				<div className="form_div">
					<Form.Group controlId="customer_1">
						<HStack>
							<Form.ControlLabel style={{ marginRight: 45, fontSize: 17 }}>품목명</Form.ControlLabel>
							<InputGroup className="searchBox">
							<Input
								value={selectedItem || ""} readOnly
							/>
								<AutoComplete /> 
									<InputGroup.Button tabIndex={-1} onClick={() => setItemModalOpen(true)}>
										<img
											src={readingGlasses}
											alt="돋보기"
											width={20}
											height={20}
											style={{ cursor: "pointer "}}
										/>
									</InputGroup.Button>
							</InputGroup>
							<Input name="customer_1" type="text" autoComplete="off" style={{ width: 200,  marginBottom: 5 }}
								value={selectedItemName || ""} readOnly />
						</HStack>
					</Form.Group>
                </div>

                <div className="form_div">
					<Form.Group controlId="storage">
						<HStack>
							<Form.ControlLabel style={{ marginRight: 30, fontSize: 17 }}>출하창고</Form.ControlLabel>
							<InputGroup className="searchBox">
							<Input
								value={selectedStorage || ""} readOnly
							/>
								<AutoComplete />
								<InputGroup.Button tabIndex={-1} onClick={() => setStorageModalOpen(true)}>
										<img
											src={readingGlasses}
											alt="돋보기"
											width={20}
											height={20}
											style={{ cursor: "pointer "}}
										/>
									</InputGroup.Button>
							</InputGroup>
							<Input name="customer_1" type="text" autoComplete="off" style={{ width: 200,  marginBottom: 5 }}
								value={selectedStorageName || ""} readOnly />
						</HStack>
					</Form.Group>
					</div>

					<SellItemSearchModal
						onItemSelect={handleItemSelect}
						handleOpen={isItemModalOpen}
						handleClose={() => setItemModalOpen(false)}
					/>

					<StorageSearchModal
						onStorageSelect={handleStorageSelect}	// emid, Incharge 받기
						handleOpen={isStorageModalOpen}
						handleClose={() => setStorageModalOpen(false)}
					/>

					</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button appearance="primary" onClick={submitSellSearch}>
					확인
				</Button>
				<Button onClick={handleClose} appearance="subtle">
					취소
				</Button>
			</Modal.Footer>
		</Modal>

		
	);
};

export default SellSearchModal;
