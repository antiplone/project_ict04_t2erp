/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "rsuite";
import AttUpdateModal from "./AttUpdateModal";

const { Column, HeaderCell, Cell } = Table;

// ## 기본사항등록 테이블 컴포넌트
// columns : columns 를 props로 받아 동적으로 설정할 수 있도록 변경
const AttItemsTable = ({ url, columns }) => {
  const [attList, setAttList] = useState([]);   // 근태값 담는 상태 변수

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const navi = useNavigate();

  // fetch(url)을 통해 데이터를 서버에서 가져와 attList 변수에 저장.
  useEffect(() => {
    // fetch("http://localhost:8081/main/regAttItems", { method: "GET" })
    // url : 컴포넌트를 선언한 곳에서 지정한 url 에서 데이터를 가져옴.
    fetch(url, { method: "GET" }) // 서버에서 데이터를 받아옴
      .then((res) => res.json())  // 가져온 데이터를 컴퓨터가 이해할 수 있도록, 응답을 JSON으로 변환
      .then((res) => {
        console.log("데이터 수신: ", res); // 돌아갈때 마다 F12 -> console창에 찍힘
        setAttList(res);  // 데이터를 저장해서 화면에 표시, 즉, 화면에 보여주기 위해 저장함
      })
      .catch((error) => console.error("데이터를 불러오지 못했습니다:", error));
  }, [url]);
  // [url] : url이 변경될 때마다 fetch 실행

  // 편집 버튼 클릭 → 모달 열기
  const updateModal = (rowData) => {
    setEditingRow({ ...rowData });
    setIsModalOpen(true);
  };

  // 근태삭제
  const deleteAtt = (a_code) => {
    console.log(a_code); // a_code가 찍히는지 확인

    if (!a_code) {    // 만약 근태코드가 없다면 alert창 띄우기
      alert("삭제할 항목이 없습니다.");
      return;
    }

    fetch(`http://localhost:8081/attendance/deleteAttItems/${a_code}`, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((res) => {
        if (res === "1") {
          alert(`근태코드 ${a_code} 삭제되었습니다.`);
          navi("/main/regAttItems");  // true라면, regAttItems 로 이동
          window.location.reload();
        } else {
          alert("삭제에 실패했습니다.");
        }
      })
      .catch((error) => console.error("삭제 중 오류 발생:", error));
  };

  return (
    <>
      <Table
        autoHeight
        style={{ marginBottom: "24px" }}
        width={800}
        data={attList}
        cellBordered
        onRowClick={(rowData) => {
          console.log(rowData);
        }}
      >
        {/* 동적으로 컬럼 생성
      true && expression 형식 : 조건이 참이면 && 뒤의 요소가 출력됨*/}
        {columns &&
          // eslint-disable-next-line react/prop-types
          columns.map((col) => (
            <Column key={col.dataKey} width={col.width} align="center">
              <HeaderCell>{col.label}</HeaderCell>
              <Cell dataKey={col.dataKey} />
            </Column>
          ))}
        {/* 버튼 컬럼 추가 */}
        <Column width={110} align="center">
          <HeaderCell>작업</HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                <Button
                  size="xs"
                  appearance="ghost"
                  color="primary"
                  style={{ marginRight: "5px" }}
                  onClick={() => updateModal(rowData)}
                >
                  수정
                </Button>
                <Button
                  size="xs"
                  appearance="ghost"
                  color="red"
                  onClick={() => deleteAtt(rowData.a_code)}
                >
                  삭제
                </Button>
              </>
            )}
          </Cell>
        </Column>
      </Table>

      <AttUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingRow={editingRow}
      />
    </>
  );
};

export default AttItemsTable;
