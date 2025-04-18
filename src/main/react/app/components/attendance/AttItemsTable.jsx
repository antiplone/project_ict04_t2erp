/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Button, Table } from "rsuite";
import AttUpdateModal from "./AttUpdateModal";
import AppConfig from "#config/AppConfig.json";
import Btn from "./Btn";

const { Column, HeaderCell, Cell } = Table;

const AttItemsTable = ({ data, columns, onReloading }) => {
  const fetchURL = AppConfig.fetch['mytest'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const deleteAtt = async (a_code) => {

    // 만약 근태코드가 없다면 alert창을 반환.
    if (!a_code) return alert("삭제할 항목이 없습니다.");

    const isDel = confirm(`삭제하면 되돌릴 수 없습니다.\n근태코드 ${a_code}, 삭제하시겠습니까?`);
    if (!isDel) return alert("삭제가 취소되었습니다.");

    try {
      const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/attendance/deleteAttItems/${a_code}`, {
        method: "DELETE",
      });

      console.log(res.status);  // 예: 200, 404, 500. 뭐라고 찍히는지 확인s

      // fetch 는 기본적으로 에러를 던지지 않기 때문에 강제에러 발생시킴(404 가 떠도 응답을 받긴 했으니 성공으로 인식함)
      // 응답 실패인 경우, Error 객체를 생성한 후 강제로 에러 발생시켜 아래쪽 코드로 못가도록 catch 블록으로 강제 이동시킴.
      if (!res.ok) throw new Error("네트워크 오류");

      const result = await res.text();

      if (result === "1") {
        alert("삭제되었습니다.");
        window.location.reload(); // 추후 fetcher로 대체 가능. remix 에서는 권장x
      } else {
        alert("삭제 실패했습니다. 서버에서 처리하지 못했습니다.");
      }
    } catch(error) {
      console.error("삭제 중 오류:", error);
      alert("삭제 요청 중 오류가 발생했습니다.");
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
                <Btn text="수정" color="blue" style={{ marginRight: "5px" }}
                   onClick={() => {setEditingRow(rowData); setIsModalOpen(true);}} />
                <Btn text="삭제" color="red" onClick={() => deleteAtt(rowData.a_code)} />
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
