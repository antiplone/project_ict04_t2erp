// 담당자 검색 모달
/* eslint-disable react/prop-types */
import AppConfig from "#config/AppConfig.json";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input, Container, Placeholder, Loader } from "rsuite";
import "../../styles/buy.css";

const { Column, HeaderCell, Cell } = Table;

const InchargeSearchModal = ({ confirm, cancel, onInchargeSelect, handleOpen, handleColse } /* = props:속성 */) => {

	const fetchURL = AppConfig.fetch["mytest"];

	const [employeeList, setEmployeeList] = useState([]);
	const [selectedIncharge, setSelectedIncharge] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState("");

	// fetch()를 통해 톰캣서버에게 데이터를 요청
	useEffect(() => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyInchargeList`, {
			method: "GET"
		})
			.then(res => res.json())
			.then(res => {
				setEmployeeList(res);
			})
			.catch((err) => {
				//console.error("담당자 조회 실패:", err);
			});
	}, []);

	const inchargeChkChange = (checked, incharge) => {
		if (checked) {
			setSelectedIncharge(incharge); // 체크된 담당자 저장
		} else {
			setSelectedIncharge(null); // 체크 해제 시 초기화
		}
	};

	return (
		<>
			<Modal open={handleOpen} onClose={handleColse} size="xs">
				<Modal.Header>
					<Modal.Title>담당자 검색</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup style={{ marginBottom: 10 }}>
						<Input
							placeholder="담당자명 또는 사원번호로 검색"
							value={searchKeyword}
							onChange={setSearchKeyword}
						/>
					</InputGroup>
					<Table
						height={400}
						data={employeeList.filter(emp =>
						(!searchKeyword ||
							emp.e_id?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
							emp.e_name?.toString().includes(searchKeyword)
						)
						)}
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
					<Button
						appearance="primary"
						onClick={() => {
							if (selectedIncharge) {
								onInchargeSelect(selectedIncharge.e_id, selectedIncharge.e_name);
							} else {
								// 선택 안 했을 경우 null 전달
								onInchargeSelect(null, null);
							}
							handleColse(); // 모달 닫기
						}}
					>
						확인
					</Button>
					<Button onClick={handleColse} appearance="subtle">
						취소
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default InchargeSearchModal;
