import React from "react";
import { Button, Modal, Table } from "rsuite";
import { Employee } from "#components/attendance/Employee";
import commute from "#components/attendance/commute.png";
import MessageBox from "#components/common/MessageBox";

const { Column, HeaderCell, Cell } = Table;
const data = Employee(); // 데이터 반환

// 출/퇴근 기록부
export default function att_commuRecords() {
  // 테이블
  const [sortColumn, setSortColumn] = React.useState();
  const [sortType, setSortType] = React.useState();
  const [loading, setLoading] = React.useState(false);

  // 모달창
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 항목 테이블
  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return data;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  return (
    <div className="attItems">
      <MessageBox text="출/퇴근 기록부(사원)" />

      <Table
        autoHeight
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
      >
        <Column width={100} align="center" sortable>
          <HeaderCell>일자</HeaderCell>
          <Cell dataKey="e_regDate" />
        </Column>

        <Column width={100} fixed sortable>
          <HeaderCell>사원명</HeaderCell>
          <Cell dataKey="e_name" />
        </Column>

        <Column width={150} sortable>
          <HeaderCell>부서명</HeaderCell>
          <Cell dataKey="e_depart" />
        </Column>

        <Column width={200} sortable>
          <HeaderCell>출근시간</HeaderCell>
          <Cell dataKey="e_attTime" />
        </Column>

        <Column width={200} sortable>
          <HeaderCell>퇴근시간</HeaderCell>
          <Cell dataKey="e_leaveTime" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>내/외근</HeaderCell>
          <Cell dataKey="e_ternal" />
        </Column>
      </Table>

      <Button variant="primary" onClick={handleOpen}>
        추가
      </Button>

      {/* 추가버튼 클릭했을 때, 모달창 */}
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>휴가항목등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={commute} alt="출퇴근 기록추가" width={550}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle">
            닫기
          </Button>
          <Button onClick={handleClose} appearance="primary">
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
