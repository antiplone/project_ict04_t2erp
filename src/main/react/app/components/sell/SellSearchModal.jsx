import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, InputGroup, AutoComplete, HStack, Input } from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import ItemSearchModal from "./ItemSearchModal";
import ClientSearchModal from "./ClientSearchModal";
import StorageSearchModal from "./StorageSearchModal";

const { Column, HeaderCell, Cell } = Table;

const searchBoxstyles = {
	width: 200,
	marginBottom: 5
  };

const SellSearchModal = ({ title, confirm, cancel, handleOpen, handleColse } /* = props:속성 */) => {
	// 물품 모달 관리
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemName, setSelectedItemName] = useState(null);
	const [isItemModalOpen, setItemModalOpen] = useState(false);

	const handleItemSelect = (emid, incharge) => {
		setSelectedItem(emid);
		setSelectedItemName(incharge);
		setItemModalOpen(false);
	};

	const handleOpenItemModal = () => {
		setItemModalOpen(true);
	};
	
	// 거래처 모달 관리
	const [selectedClient, setSelectedClient] = useState(null);
	const [selectedClientName, setSelectedClientName] = useState(null);
	const [isClientModalOpen, setClientModalOpen] = useState(false);

	const handleClientSelect = (client_code, client_name) => {
		setSelectedClient(client_code);
		setSelectedClientName(client_name);
		setClientModalOpen(false);
	};

	const handleOpenClientModal = () => {
		setClientModalOpen(true);
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

	const handleOpenStorageModal = () => {
		setStorageModalOpen(true);
	};

	return (
		<Modal open={handleOpen} onClose={handleColse} style={{width: 700}}>
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form className="addForm" layout="inline">

				<div className="form_div">
					<Form.Group controlId="customer_1">
						<HStack>
							<Form.ControlLabel style={{ marginRight: 45, fontSize: 17 }}>품목명</Form.ControlLabel>
							<InputGroup style={searchBoxstyles}>
							<Input
								placeholder='물품'
								value={selectedItem || ""} readOnly
							/>
								<AutoComplete />
									<InputGroup.Button tabIndex={-1}>
										<SearchIcon onClick={handleOpenItemModal} />
									</InputGroup.Button>
							</InputGroup>
							<Input name="customer_1" type="text" autoComplete="off" style={{ width: 200,  marginBottom: 5 }}
								value={selectedItemName || ""} readOnly />
						</HStack>
					</Form.Group>
                </div>
                <div className="form_div">
					<Form.Group controlId="customer_2">
						<HStack>
							<Form.ControlLabel style={{ marginRight: 45, fontSize: 17 }}>거래처</Form.ControlLabel>
							<InputGroup style={searchBoxstyles}>
							<Input
								placeholder='거래처'
								value={selectedClient || ""} readOnly
							/>
								<AutoComplete />
									<InputGroup.Button tabIndex={-1} >
										{/* 모달 열기 버튼 */}
										<SearchIcon onClick={handleOpenClientModal} />
									</InputGroup.Button>
							</InputGroup>
							<Input name="customer_1" type="text" autoComplete="off" style={{ width: 200,  marginBottom: 5 }}
								value={selectedClientName || ""} readOnly />
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
									<InputGroup.Button tabIndex={-1}>
										<SearchIcon onClick={handleOpenStorageModal} />
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
					handleColse={() => setItemModalOpen(false)}
					/>

					<ClientSearchModal
					title="거래처 선택"
					confirm="확인"
					cancel="취소"
					onClientSelect={handleClientSelect}	// client_code, client_name 받기
					handleOpen={isClientModalOpen}
					handleColse={() => setClientModalOpen(false)}
					/>


					<StorageSearchModal
						title="창고 선택"
						confirm="확인"
						cancel="취소"
						onStorageSelect={handleStorageSelect}	// emid, Incharge 받기
						handleOpen={isStorageModalOpen}
						handleColse={() => setStorageModalOpen(false)}
					/>

					</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button appearance="primary">
					{confirm}
				</Button>
				<Button onClick={handleColse} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>

		
	);
};

SellSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
};

export default SellSearchModal;
