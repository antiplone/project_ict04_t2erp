// 거래처 검색 모달
/* eslint-disable react/prop-types */
import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const ClientSearchModal = ({ title, confirm, cancel, onClientSelect, handleOpen, handleColse } /* = props:속성 */) => {

	const [clientList, setClientList] = useState([]);
	const [selectedClient, setSelectedClient] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState("");

	const fetchURL = AppConfig.fetch["mytest"];

	// fetch()를 통해 톰캣서버에게 데이터를 요청
	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyClientList`, {
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

	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>거래처 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<InputGroup style={{ marginBottom: 10 }}>
					<Input
						placeholder="거래처명 또는 코드로 검색"
						value={searchKeyword}
						onChange={setSearchKeyword}
					/>
				</InputGroup>
				<Table
					height={400}
					data={clientList.filter(client =>
					(!searchKeyword ||
						client.client_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
						client.client_code?.toString().includes(searchKeyword)
					)
					)}
				>

					<Column width={100} align="center" fixed>
						<HeaderCell>선택</HeaderCell>

						<Cell>{(clientData) => (
							<Checkbox
								checked={selectedClient?.client_code === clientData.client_code}
								onChange={(_, checked) =>
									handleCheckboxChange(checked, clientData)}
							/>
						)}
						</Cell>
					</Column>

					<Column width={100} align="center" fixed>
						<HeaderCell>거래처 코드</HeaderCell>
						<Cell>{(clientData) => clientData.client_code}</Cell>
					</Column>

					<Column width={250}>
						<HeaderCell>거래처명</HeaderCell>
						<Cell>{(clientData) => clientData.client_name}</Cell>
					</Column>
				</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button
					appearance="primary"
					onClick={() => {
						if (selectedClient) {
							onClientSelect(selectedClient.client_code, selectedClient.client_name);
						} else {
							// 선택 안 했을 경우 null 전달
							onClientSelect(null, null);
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

ClientSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",

};

export default ClientSearchModal;
