// 담당자 검색 모달
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";
import "../../styles/buy.css";

const { Column, HeaderCell, Cell } = Table;

const InchargeSearchModal = ({  confirm, cancel, onInchargeSelect, handleOpen, handleColse } /* = props:속성 */) => {
	
	const [employeeList, setEmployeeList] = useState([]);
	const [selectedIncharge, setSelectedIncharge] = useState(null);

		// fetch()를 통해 톰캣서버에게 데이터를 요청
		useEffect(() => {
			fetch("http://localhost:8081/buy/buyInchargeList", {
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

	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>담당자 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Table
				height={400}
				data={(employeeList ?? []).filter(emp => emp !== null && emp !== undefined)}
			>
				<Column width={100} align="center" fixed>
					<HeaderCell>선택</HeaderCell>
					
					<Cell>{(empData) => (
						<Checkbox 
						checked={selectedIncharge?.e_id === empData.e_id} 
                        onChange={(_, checked) => 
							inchargeChkChange(checked, empData)}
						/>
						)}
			  		</Cell>
				</Column>

				<Column width={100} align="center" fixed>
					<HeaderCell>사번</HeaderCell>
					
					<Cell>{(empData) => empData.e_id}</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>담당자명</HeaderCell>
					<Cell>{(empData) => empData.e_name}</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>부서</HeaderCell>
					<Cell>{(empData) => empData.d_name}</Cell>
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

InchargeSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
};

export default InchargeSearchModal;
