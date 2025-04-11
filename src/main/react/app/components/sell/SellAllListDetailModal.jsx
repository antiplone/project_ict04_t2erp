import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox } from "rsuite";

const { Column, HeaderCell, Cell } = Table;


const SellAllListDetailModal = ({ title, confirm, cancel, onReqClientSelect, handleOpen, handleColse } /* = props:속성 */) => {
	
	const [allDetail, setAllDetail] = useState([]);

		// fetch()를 통해 톰캣서버에게 데이터를 요청
		useEffect((sc_no) => {
			fetch("http://localhost:8081/sell/reqClientDetail/" + sc_no)
			.then(res => res.json())
			.then(res => {
				setReqClientList(res);
			});
		}, []);
	
	return (
		<Modal open={handleOpen} onClose={handleColse} size="xs">
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Table
				height={400}
				bordered
				cellBordered
				autoHeight
				affixHeader
				affixHorizontalScrollbar
				data={reqClientList}
			>

					<Column width={50} align="center" fixed resizable>
						<HeaderCell>No.</HeaderCell>
						<Cell>{(rowData) => rowData.sc_no}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>거래처명</HeaderCell>
						<Cell>{(rowData) => rowData.sc_client_name}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>대표자명</HeaderCell>
						<Cell>{(rowData) => rowData.sc_ceo}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>사업자등록번호</HeaderCell>
						<Cell>{(rowData) => rowData.sc_biz_num}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>이메일</HeaderCell>
						<Cell>{(rowData) => rowData.sc_email}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>연락처</HeaderCell>
						<Cell>{(rowData) => rowData.sc_tel}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>거래처 주소</HeaderCell>
						<Cell>{(rowData) => rowData.sc_address}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>업종</HeaderCell>
						<Cell>{(rowData) => rowData.sc_type}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>업태</HeaderCell>
						<Cell>{(rowData) => rowData.sc_industry}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>비고</HeaderCell>
						<Cell>{(rowData) => rowData.sc_note}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>요청자</HeaderCell>
						<Cell>{(rowData) => rowData.sc_no}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>승인상태</HeaderCell>
						<Cell>{(rowData) => rowData.sc_status}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>등록일</HeaderCell>
						<Cell>{(rowData) => rowData.sc_no}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>결재담당자</HeaderCell>
						<Cell>{(rowData) => rowData.sc_no}</Cell>
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>결재 관련 비고</HeaderCell>
						{/* <Cell>{(rowData) => rowData.결재 관련 비고}</Cell> */}
					</Column>

					<Column width={100} fixed resizable>
						<HeaderCell>결재처리일</HeaderCell>
						<Cell>{(rowData) => rowData.결재처리일}</Cell>
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

SellAllListDetailModal.defaultProps = {
	// props가 설정이 안되어있으면, 기본(default)으로 들어갑니다.
	title: "제목을 입력해주세요.",
	confirm: "확인",
	cancel: "취소",
	
};

export default SellAllListDetailModal;
