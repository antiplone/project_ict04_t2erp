/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

// 휴가항목 테이블 컴포넌트
// url : 컴포넌트를 선언한 곳(main.Att_regVacaItems.jsx)에서 지정한 url 주소를 받음
// columns : columns 를 props로 받아 동적으로 설정할 수 있도록 변경
// 아직 정리가 안되었습니다.. 일단 돌아가는지 확인해보려고 넣었습니다.
const VacaItemsTable = ({ url, columns }) => {
  
  const [vacaList, setVacaList] = useState([]);   // 휴가 항목값 담는 상태 변수
  const [modal, setModal] = useState(false);    // 수정,삭제 모달창
  const [editOpenModal, setEditOpenModal] = useState(null);

  const editModal = (rowData) => {
    setEditOpenModal({...rowData});
    setModal(true);
  }

  // 휴가항목리스트 불러오기. fetch를 통해 데이터를 서버(백엔드)에서 가져와 vacaList 변수에 저장
  useEffect(() => {
    fetch(url, {method: "GET"})
    .then(res => res.json())
    .then(res => {
      console.log("데이터 수신: ", res);  // res가 잘 돌아가는지 확인
      setVacaList(res);
    })
    .catch(error => console.error("데이터를 불러오지 못했습니다... => ", error));
  }, [url]);  // url이 변경될 때만 useEffect() 실행

  return (
    <Table autoHeight width={870} cellBordered data={vacaList} style={{ margin: "10px 0 20px 0"}}>
      {columns && columns.map((column) => (
        <Column key={column.datakey} width={column.width} align="center">
          <HeaderCell>{column.label}</HeaderCell>
          <Cell dataKey={column.dataKey} />
        </Column>
      ))}
      <Column width={110} align="center">
        <HeaderCell>작업</HeaderCell>
        <Cell>
          {(rowData)=>(
            <>
              <Button size="xs" appearance="ghost" color="blue" onClick={() => editModal(rowData)} style={{ marginRight: "5px" }}>수정</Button>
              <Button size="xs" appearance="ghost" color="red">삭제</Button>
            </>
          )}
        </Cell>
      </Column>
    </Table>
  );
};

export default VacaItemsTable;
