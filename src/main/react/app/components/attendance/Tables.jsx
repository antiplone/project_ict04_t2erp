/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button, Checkbox, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

export default function Tables({ url, columns }) {
  const [resiData, setResiData] = useState([]); // 퇴사자 데이터를 저장하는 상태 변수.
  const [chkRow, setChkRow] = useState([]);
  const navigate = useNavigate();
  
  // 인사 관리 - 퇴사자 리스트 값 불러오기(STS4 console창에서 두 번 돌아가지만, 실제 배포일 땐 한 번만 돌아간다고 함)
  useEffect(() => {
    fetch(url, { method: "GET" })
    .then(res => res.json())
    .then(res => {
      console.log("퇴직 관리 메인 페이지입니다. ", res);  // 여기까지 잘 오는지 확인용
      setResiData(res);
    })
    .catch(error => console.error("퇴사자 데이터를 불러오지 못했습니다ㅠ => ", error));
  }, [url]);

  return (
    <Table autoHeight cellBordered width={900} data={resiData} style={{ marginTop: "10px" }}>
      {/* cellBordered: 테이블 세로선 생성 */}
      
      {/* ✅ 체크박스 컬럼 (고정) */}
      <Column width={50} align="center" fixed>
        <HeaderCell>
          <Checkbox
            checked={chkRow.length === resiData.length}
            indeterminate={chkRow.length > 0 && chkRow.length < resiData.length}
            onChange={(_, checked) => {
              if (checked) setChkRow(resiData.map(row => row.resi_list_no));
              else setChkRow([]);
            }}
          />
        </HeaderCell>
        <Cell>
          {rowData => (
            <Checkbox
              checked={chkRow.includes(rowData.resi_list_no)}
              onChange={(_, checked) => {
                setChkRow(prev =>
                  checked ? [...prev, rowData.resi_list_no] : prev.filter(id => id !== rowData.resi_list_no)
                );
              }}
            />
          )}
        </Cell>
      </Column>

      {/* ✅ 일반 컬럼들 동적 렌더링 */}
      {columns.map(col => (
        <Column key={col.dataKey} width={col.width} align="center">
          <HeaderCell>{col.label}</HeaderCell>
          {col.render ? (
            <Cell>{rowData => col.render(rowData)}</Cell>
          ) : (
            <Cell dataKey={col.dataKey} />
          )}
        </Column>
      ))}

        <Column width={80} align="center" fixed="right">
          <HeaderCell>상태</HeaderCell>
          <Cell style={{ padding: '6px' }}>
            {rowData => (
              <Button appearance="link" onClick={() => navigate(`/retirement/${rowData.resi_list_no}`)}>조회</Button>
            )}
          </Cell>
        </Column>
      </Table>
  );
}
