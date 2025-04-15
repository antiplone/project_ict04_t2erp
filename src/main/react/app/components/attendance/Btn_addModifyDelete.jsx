/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Table } from "rsuite";
import Btn from "#components/attendance/Btn.jsx";

const { Column, HeaderCell, Cell } = Table;

export default function Btn_addModifyDelete({ width, align="center" }) {

  return (
    <Column width={width} align={align} >
      <HeaderCell>상태버튼</HeaderCell>
      <Cell>
        {(rowData) => (
          <>
            <Btn text="추가" style={{ marginRight: "5px" }}
              onClick={() => { setEditingRow(rowData); setIsModalOpen(true); }}/>
            <Btn text="수정" style={{ marginRight: "5px" }}
              onClick={() => { setEditingRow(rowData); setIsModalOpen(true); }}/>
            <Btn text="삭제" color="red" 
              onClick={() => deleteAtt(rowData.a_code)}/>
          </>
        )}
      </Cell>
    </Column>
  );
};

