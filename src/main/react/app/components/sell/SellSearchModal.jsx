import React, { useState, useEffect } from "react";
import { Button, Modal, Form, InputGroup, AutoComplete, HStack, Input } from "rsuite";
import ItemSearchModal from "./SellItemSearchModal";
import StorageSearchModal from "./SellStorageSearchModal";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";

// SellSearchModal => 판매 물품 검색 > 물품, 창고 검색 가능한 모달 페이지

// 검색바 스타일 지정
const searchBoxstyles = {
	width: 200,
	marginBottom: 5
  };

const SellSearchModal = ({ title, confirm, cancel, handleOpen, handleClose, onSearchResult } /* = props:속성 */) => {
	
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

	const [searchResultList, setSearchResultList] = useState([]);
	
	const fetchURL = AppConfig.fetch['mytest'];

	// 입력한 값을 백엔드로 전달
	const submitSellSearch = (e) => {
		e.preventDefault();
		
		const payload = {
			item_code: selectedItem,
			storage_name: selectedStorageName,
		};
	
		console.log("제출할 전체 데이터:", payload); // 확인용
	
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchResultItemList`, {
			method: "POST", // 보통 검색 필터는 POST로 보냄. GET은 URL에 붙여야 해서 복잡함.
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("검색 결과:", data);
				setSearchResultList(data);
				if (onSearchResult) {
					onSearchResult(data); // 부모에게 전달
				}
				handleClose(); // 모달 닫기 추가!!
			})
			.catch((error) => {
				console.error("검색 오류:", error);
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
		<Modal open={handleOpen} onClose={handleClose} >
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			{/* overflowX: 'hidden' => 가로 스크롤 없애기 (넘치는 영역 제거) */}
			<Modal.Body style={{ overflowX: 'hidden' }}>
			<Form className="addForm" layout="inline">

				<div className="form_div">
					<Form.Group controlId="customer_1">
						<HStack>
							<Form.ControlLabel style={{ marginRight: 45, fontSize: 17 }}>품목명</Form.ControlLabel>
							<InputGroup style={searchBoxstyles}>
							<Input
								placeholder='품목명'
								value={selectedItem || ""} readOnly
							/>
								<AutoComplete /> 
									{/* AutoComplete => 추후 정리 필요 */}
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
							<InputGroup style={searchBoxstyles}>
							<Input
								placeholder='창고'
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

					<ItemSearchModal
						title="물품 선택"
						confirm="확인"
						cancel="취소"
						onItemSelect={handleItemSelect}
						handleOpen={isItemModalOpen}
						handleClose={() => setItemModalOpen(false)}
					/>

					<StorageSearchModal
						title="창고 선택"
						confirm="확인"
						cancel="취소"
						onStorageSelect={handleStorageSelect}	// emid, Incharge 받기
						handleOpen={isStorageModalOpen}
						handleClose={() => setStorageModalOpen(false)}
					/>

					</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button appearance="primary" onClick={submitSellSearch}>
					{confirm}
				</Button>
				<Button onClick={handleClose} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>

		
	);
};

SellSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "상세 검색",
	confirm: "검색",
	cancel: "취소",
};

export default SellSearchModal;
