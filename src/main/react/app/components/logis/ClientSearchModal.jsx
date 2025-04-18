// 거래처 검색 모달
/* eslint-disable react/prop-types */
import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

function ClientSearchModal ({title = "거래처 검색", confirm = "확인", cancel = "취소", onClientSelect, handleOpen , handleColse = () => {}}) {

	const [clientList, setClientList] = useState([]);
	const [selectedClient, setSelectedClient] = useState(null);

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
		onClientSelect(
			selectedClient?.client_code ?? null,
			selectedClient?.client_name ?? null
		);
		handleColse();
	};

	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>거래처 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table
					height={400}
					data={(clientList ?? []).filter(client => client !== null && client !== undefined)}
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
				<Button onClick={handleSubmit} appearance="primary">
					{confirm}
				</Button>
				<Button onClick={() => setSelectedClient(null)} appearance="ghost" color="orange">
					초기화
				</Button>
				<Button onClick={handleColse} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ClientSearchModal;
