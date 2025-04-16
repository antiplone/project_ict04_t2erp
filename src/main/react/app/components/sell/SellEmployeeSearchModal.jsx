import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";
import AppConfig from "#config/AppConfig.json";

const { Column, HeaderCell, Cell } = Table;

const SellEmployeeSearchModal = ({ title, confirm, cancel, onInchargeSelect, handleOpen, handleColse } /* = props:속성 */) => {
	
	const [employeeList, setEmployeeList] = useState([]);
	const [selectedIncharge, setSelectedIncharge] = useState(null);

	const fetchURL = AppConfig.fetch['mytest'];

		// fetch()를 통해 톰캣서버에게 데이터를 요청
		useEffect(() => {
			fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchEmployee`, {
				method: "GET"
			})
			.then(res => res.json())
			.then(res => {
				setEmployeeList(res);
			});
		}, []);

		const inchargeChkChange = (checked, incharge) => {
			if (checked) {
				setSelectedIncharge(incharge); // 체크된 담당자 저장
			} else {
				setSelectedIncharge(null); // 체크 해제 시 초기화
			}
		};
		
		// 선택 완료 처리
		const handleSubmit = () => {
			if (selectedIncharge) {
				onInchargeSelect(selectedIncharge.e_id, selectedIncharge.e_name);
				handleColse();
			}
		};

		// 모달이 열릴 때 선택값 초기화
		useEffect(() => {
			if (handleOpen) {
				setSelectedIncharge(null);
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
				data={employeeList}
			>
				<Column width={100} align="center" fixed>
					<HeaderCell>선택</HeaderCell>
					
					<Cell>{(rowData) => (
						<Checkbox 
						checked={selectedIncharge?.e_id === rowData.e_id} 
                        onChange={(_, checked) => 
							inchargeChkChange(checked, rowData)}
						/>
						)}
			  		</Cell>
				</Column>

				<Column width={100} align="center" fixed>
					<HeaderCell>사번</HeaderCell>
					
					<Cell>{(rowData) => rowData.e_id}</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>담당자명</HeaderCell>
					<Cell>{(rowData) => rowData.e_name}</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>부서</HeaderCell>
					<Cell>{(rowData) => rowData.d_name}</Cell>
				</Column>
	  		</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button /* href="/" */ onClick={handleSubmit} appearance="primary">
					{confirm}
				</Button>
				<Button onClick={handleColse} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

SellEmployeeSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
};

export default SellEmployeeSearchModal;
