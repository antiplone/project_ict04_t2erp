/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Button, Table } from "rsuite";
import AttUpdateModal from "./AttUpdateModal";

const { Column, HeaderCell, Cell } = Table;

const AttItemsTable = ({ data, columns, onReloading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const deleteAtt = async (a_code) => {

    // 만약 근태코드가 없다면 alert창을 반환.
    if (!a_code) return alert("삭제할 항목이 없습니다.");

    const res = await fetch(`http://localhost:8081/attendance/deleteAttItems/${a_code}`, {
      method: "DELETE",
    });
    const result = await res.text();
    if (result === "1") {
      alert(`근태코드 ${a_code} 삭제되었습니다.`);
      // navigate("/main/att_regAttItems");
      window.location.reload(); // 추후 fetcher로 대체 가능. remix 에서는 사용x
      onClose();
      onReloading(); // <- 삭제 후 테이블 데이터를 다시 불러오기 위해 이 함수를 콜백한다.
    } else {
      alert("삭제 실패했습니다.");
    }
  };
  

  return (
    <>
      <Table
        autoHeight
        style={{ marginBottom: "24px" }}
        width={800}
        data={data ?? []}
        cellBordered
      >
        {columns.map(col => (
          <Column key={col.dataKey} width={col.width} align="center">
            <HeaderCell>{col.label}</HeaderCell>
            <Cell dataKey={col.dataKey} />
          </Column>
        ))}

        <Column width={110} align="center">
          <HeaderCell>작업</HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                <Button
                  size="xs"
                  appearance="ghost"
                  color="blue"
                  style={{ marginRight: "5px" }}
                  onClick={() => {
                    setEditingRow(rowData);
                    setIsModalOpen(true);
                  }}>수정</Button>
                <Button
                  size="xs"
                  appearance="ghost"
                  color="red"
                  onClick={() => deleteAtt(rowData.a_code)}>삭제</Button>
              </>
            )}
          </Cell>
        </Column>
      </Table>

      <AttUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingRow={editingRow}
        onReloading={onReloading}
      />
    </>
  );
};

export default AttItemsTable;
