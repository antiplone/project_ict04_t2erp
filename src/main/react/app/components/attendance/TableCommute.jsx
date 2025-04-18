/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Table } from 'rsuite';
import { useEffect, useState } from "react";


const { Column, HeaderCell, Cell } = Table;

export default function TableCommute({ url, columns }) {
  
  const [commute, setCommute] = useState([]);
  
  useEffect(() => {
    fetch(url, { method: "GET" })
    .then(res => res.json())
    .then(res => {
      console.log("Oh! 잘 넘어왔습니다! ", res);  // 여기까지 잘 오는지 확인용
      setCommute(res);
    })
    .catch(error => console.error("데이터를 불러오지 못했습니다ㅠ => ", error));
  }, [url]);

  return(
    <Table cellBordered autoHeight data={commute} onRowClick={rowData => { console.log(rowData); }} width={910}>
      {/* 컬럼 반복문 돌리기 */}
      {columns.map((col, index) => (
        <Column key={index} width={col.width} align={col.align || "left"} fixed={col.fixed || false}>
          <HeaderCell>{col.label}</HeaderCell>
          <Cell dataKey={col.dataKey} />
        </Column>
      ))}

      <Column width={80} fixed="right">
        <HeaderCell>작업</HeaderCell>

        <Cell style={{ padding: '6px' }}>
          {rowData => (
            <Button appearance="link" onClick={() => alert(`ID: ${rowData.co_list_no}`)}>
              Edit
            </Button>
          )}
        </Cell>
      </Column>
    </Table>
  )
}
