import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";

const { Column, HeaderCell, Cell } = Table;


const SellClientSearchModal = ({ title, confirm, cancel, onClientSelect, handleOpen, handleColse } /* = props:속성 */) => {
	
	const [clientList, setClientList] = useState([]);
	const [selectedClient, setSelectedClient] = useState(null);

		// fetch()를 통해 톰캣서버에게 데이터를 요청
		useEffect(() => {
			fetch("http://localhost:8081/sell/searchClient", {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setClientList(res);
			});
		}, []);
	
		const handleCheckboxChange = (checked, client) => {
			if (checked) {
				setSelectedClient(client); // 체크된 클라이언트 저장
			} else {
				setSelectedClient(null); // 체크 해제 시 초기화
			}
		};
		
		// 선택 완료 처리
		const handleSubmit = () => {
			if (selectedClient) {
				onClientSelect(selectedClient.client_code, selectedClient.client_name);
				handleColse();
			}
		};

		// 모달이 열릴 때 선택값 초기화
		useEffect(() => {
			if (handleOpen) {
				setSelectedClient(null);
			}
		}, [handleOpen]);

	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Table
				height={400}
				data={clientList}
			>

				<Column width={100} align="center" fixed>
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

				<Column width={250}>
					<HeaderCell>거래처명</HeaderCell>
					<Cell>{(rowData) => rowData.client_name}</Cell>
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

SellClientSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
	
};

export default SellClientSearchModal;
