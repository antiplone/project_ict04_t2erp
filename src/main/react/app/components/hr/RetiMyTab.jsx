/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tooltip, Whisper } from "rsuite";
import "#styles/common.css";
const { Column, HeaderCell, Cell } = Table;

export default function RetiMyTab({ retiColumns, retiData }) {
  const navigate = useNavigate();

  return retiData.length === 0 ? (
    <div style={{ padding: "20px", textAlign: "center" }}>
      퇴직 신청 내역이 없습니다.
    </div>
  ) : (
    <Table
      height={500}
      cellBordered
      data={retiData}
      tableLayout="fixed"             // ← 고정 레이아웃
      rowHeight={48}
    >
      {retiColumns.map(col => {
        // 긴 텍스트용 컬럼은 flexGrow로 남는 공간 채우기
        const isFlexible = ["re_reject_reason", "re_note"].includes(col.dataKey);

        return (
          <Column
            key={col.dataKey}
            {...(isFlexible
              ? { flexGrow: 1 }
              : { width: col.width })}      // width or flexGrow
            className="text_center"
          >
            <HeaderCell style={{ backgroundColor: "#f8f9fa" }}>
              {col.label}
            </HeaderCell>

            {col.dataKey === "re_approval_status" ? (
              // 1. 승인상태 컬럼
              <Cell>
                {rowData => {
                  const status = rowData.re_approval_status || "";
                  if (!status) {
                    return (
                      <span style={{ color: "#999", fontWeight: "bold" }}>-</span>
                    );
                  }
                  const color =
                    status === "승인"
                      ? "#007bff"
                      : status === "반려"
                      ? "#e74c3c"
                      : "#2980b9";
                  return (
                    <span style={{ color, fontWeight: "bold" }}>
                      {status}
                    </span>
                  );
                }}
              </Cell>

            ) : isFlexible ? (
              // 2. 긴 텍스트 컬럼 (툴팁 + ellipsis)
              <Cell>
                {rowData => {
                  const text = rowData[col.dataKey] || "";
                  return (
                    <Whisper
                      placement="top"
                      speaker={<Tooltip>{text}</Tooltip>}
                    >
                      <div
                        className="text_left"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {text}
                      </div>
                    </Whisper>
                  );
                }}
              </Cell>

            ) : (
              // 3. 나머지 일반 컬럼
              <Cell dataKey={col.dataKey} />
            )}
          </Column>
        );
      })}
    </Table>
  );
}
