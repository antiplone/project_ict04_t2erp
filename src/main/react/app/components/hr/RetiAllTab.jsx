/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React from "react";
import Btn from "#components/attendance/Btn.jsx";
import { useNavigate } from "react-router-dom";
import { Table } from "rsuite";
import "#styles/common.css";
const { Column, HeaderCell, Cell } = Table;

// 전체 퇴직 리스트: 관리자용
export default function RetiAllTab({ retiData, retiColumns }) {
  const navigate = useNavigate();

  if (!retiData || retiData.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        퇴직 신청 내역이 없습니다.
      </div>
    );
  }

  return (
    <Table
      height={500}
      cellBordered
      data={retiData}
      tableLayout="fixed"   // ← 고정 레이아웃
      rowHeight={48}
    >
      {retiColumns.map((col) => {
        const isFlexible = ["re_reject_reason", "re_note"].includes(
          col.dataKey
        );

        return (
          <Column
            key={col.dataKey}
            {...(isFlexible
              ? { flexGrow: 1 }
              : { width: col.width })}
            className="text_center"
          >
            <HeaderCell style={{ backgroundColor: "#f8f9fa" }}>
              {col.label}
            </HeaderCell>

            {col.dataKey === "re_approval_status" ? (
              // 1) 승인 상태 컬럼
              <Cell>
                {(rowData) => {
                  const status = rowData.re_approval_status || "";
                  if (!status) {
                    return (
                      <span
                        style={{ color: "#999", fontWeight: "bold" }}
                      >
                        -
                      </span>
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
              // 2) 긴 텍스트 컬럼: ellipsis + title 툴팁
              <Cell>
                {(rowData) => {
                  const text = rowData[col.dataKey] || "";
                  return (
                    <span
                      title={text}
                      style={{
                        display: "inline-block",
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {text}
                    </span>
                  );
                }}
              </Cell>
            ) : (
              // 3) 일반 컬럼
              <Cell dataKey={col.dataKey} />
            )}
          </Column>
        );
      })}

      {/* 처리 버튼 컬럼 (고정폭) */}
      <Column width={70} fixed="right" className="text_center">
        <HeaderCell style={{ backgroundColor: "#f8f9fa" }}>
          처리
        </HeaderCell>
        <Cell style={{ padding: "6px" }}>
          {(rowData) => (
            <Btn
              text="검토"
              color="green"
              style={{ width: 60 }}
              onClick={() =>
                navigate(
                  `/main/hr-retirement-detail/${rowData.e_id}`
                )
              }
            />
          )}
        </Cell>
      </Column>
    </Table>
  );
}
