import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, InputGroup, Input } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";

// SellEmployeeSearchModal => 담당자 검색 모달 페이지

const { Column, HeaderCell, Cell } = Table;

const SellEmployeeSearchModal = ({ title, confirm, cancel, onInchargeSelect, handleOpen, handleClose } /* = props:속성 */) => {
	
	const [employeeList, setEmployeeList] = useState([]);
	const [keyword, setKeyword] = useState("");
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
		
		// 키워드 검색 시 데이터 조회
		const handleSearch = (keyword) => {
			console.log("키워드: ", keyword);
			if (keyword.trim() === "") {
				// 빈 검색어면 전체 리스트 다시 불러오기
				
				fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchEmployee`, {
					method: "GET"
				})
				.then(res => res.json())
				.then(res => setEmployeeList(res));
			} else {
				// 키워드로 검색 요청
				fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchDetailEmployee/${keyword}`, {
					method: "GET"
				})
				.then(res => res.json())
				.then(res => setEmployeeList(res));
			}
		}

		// 선택 완료 처리
		const handleSubmit = () => {
			if (selectedIncharge) {
				onInchargeSelect(selectedIncharge.e_id, selectedIncharge.e_name);
				handleClose();
			}
		};

		// 모달이 열릴 때 선택값 초기화 + 전체 리스트 불러오기
		useEffect(() => {
			if (handleOpen) {
				setSelectedIncharge(null);
				setKeyword("");
				
				// 전체 리스트 다시 불러오기
				fetch(`${fetchURL.protocol}${fetchURL.url}/sell/searchEmployee`, {
					method: "GET"
				})
				.then(res => res.json())
				.then(res => setEmployeeList(res));
			}
		}, [handleOpen]);

	return (
		<Modal open={handleOpen} onClose={handleClose} size="xs">
			
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<InputGroup>
					<InputGroup.Addon style={{ width: 90 }}>
						검색어
					</InputGroup.Addon>
					<Input style={{ width: 150 }}
						placeholder='찾는 담당자를 입력하세요'
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
				<Button onClick={handleClose} appearance="subtle">
					{cancel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

SellEmployeeSearchModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "담당자 선택",
	confirm: "확인",
	cancel: "취소",
};

export default SellEmployeeSearchModal;
