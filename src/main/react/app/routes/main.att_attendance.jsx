import React from "react";
import { Button, Modal, Table } from "rsuite";
import { Employee } from "#components/attendance/Employee";
import att from "#components/attendance/att.png";
import MessageBox from "#components/common/MessageBox";

const { Column, HeaderCell, Cell } = Table;
let data = Employee();


export default function att_attendance() {

  // 모달창
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 검색 모달창
  const [searchModal, setSearchModal] = React.useState(false);
  const searchOpen = () => setSearchModal(true);
  const searchClose = () => setSearchModal(true);

  return (
    <div className="attItems">
      <MessageBox text="근태조회" />

      <Table autoHeight data={data}>
        <Column width={100} align="center">
          <HeaderCell>근태번호</HeaderCell>
          <Cell dataKey="e_regDate"></Cell>
        </Column>

        <Column width={100} align="center">
          <HeaderCell>사원명</HeaderCell>
          <Cell dataKey="e_name" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>근태코드</HeaderCell>
          <Cell dataKey="e_attCode" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>근태수</HeaderCell>
          <Cell dataKey="e_att" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>휴가명</HeaderCell>
          <Cell dataKey="e_attCode" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>비고</HeaderCell>
          <Cell dataKey="e_text" />
        </Column>
      </Table>

      <Button
        variant="primary"
        style={{ marginTop: "16px" }}
        onClick={handleOpen}
      >
        추가
      </Button>
      <Button
        variant="primary"
        style={{ margin: "16px 0 0 12px" }}
        onClick={searchOpen}
      >
        검색
      </Button>

      {/* 추가버튼 클릭했을 때, 모달창 */}
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>근태항목등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={att} alt="근태추가" width={550} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle">
            닫기
          </Button>
          <Button onClick={handleClose} appearance="primary">
            추가
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
