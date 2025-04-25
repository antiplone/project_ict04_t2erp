/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Link } from "@remix-run/react";
import { Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

// 전체 퇴직 리스트: 관리자용
export default function RetiAllTab({ retiData, retiColumns }) {

  return (
    retiData.length === 0 ? (
      <div style={{ padding: "20px", textAlign: "center" }}>
        퇴직 신청 내역이 없습니다.
      </div>
    ) : (
    <Table autoHeight cellBordered data={retiData || []}>
      {/* data.map 에러 방지 위해 data || [] 사용 */}
      {retiColumns.map(col => (
        <Column key={col.dataKey} width={col.width} align="center">
          <HeaderCell>{col.label}</HeaderCell>
          
          {col.dataKey === "re_approval_status" ? (
          // 1. 승인상태일 때, 글자색 설정
          <Cell>
            {rowData => {   // rowData는 한 줄(Row)의 객체라는 뜻.
              const status = rowData.re_approval_status;  // rowData.re_approval_status를 기준으로 상태를 구분한다.

              // null, undefined, 빈 문자열 → '-' 처리
              if (!status) {
                return <span style={{ color: "#999", fontWeight: "bold" }}>-</span>;
              }

              const color =
                status === "승인" ? "#27ae60" :
                status === "반려" ? "#e74c3c" :
                "#2980b9";    // 기본: 파랑
              return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
            }}
          </Cell>

          // 2. 긴 텍스트는 ... 처리해서 마우스 오버시, 전체 내용을 툴팁으로 보여주기
          ) : ["re_reject_reason", "re_note"].includes(col.dataKey) ? (
          <Cell>
            {rowData => (
              <span
                title={rowData[col.dataKey] || ""}    // 마우스를 올리면 전체 텍스트 툴팁으로 표시
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  whiteSpace: "nowrap",     // 줄바꿈 방지
                  overflow: "hidden",       // 내용이 셀을 넘으면 잘라냄
                  textOverflow: "ellipsis"  // 넘친 부분을 ...으로 표시
                }}
              >
                {rowData[col.dataKey]}
              </span>
            )}
          </Cell>

          // 3. 나머지 일반 셀
          ) : (
          <Cell dataKey={col.dataKey} /> )}
        </Column>
      ))}

      <Column width={70} fixed="right" align="center">
        <HeaderCell>처리</HeaderCell>
        <Cell style={{ padding: '6px' }}>
          {rowData => (
            <Link to={`/main/hr-retirement-detail/${rowData.e_id}`}>
              검토
            </Link>
          )}
        </Cell>
      </Column>
    </Table>
  ));
}
