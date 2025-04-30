/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from "react";
import { Button, ButtonToolbar, Notification, Table, toaster } from "rsuite";
import VacaUpdateModal from "./VacaUpdateModal";
import AppConfig from "#config/AppConfig.json";
import Btn from "./Btn";
import "#styles/common.css";
import { useToast } from '#components/common/ToastProvider';  // 경고창

const { Column, HeaderCell, Cell } = Table;

// 삭제 confirm 창(확인/취소)
function confirmDelete() {
  return new Promise((resolve) => {
    let key = null;

    const message = (
      <Notification type="warning" header="근태 삭제" closable>
        <p>삭제하면 되돌릴 수 없습니다.</p><p>삭제하시겠습니까?</p>
        <hr />
        <ButtonToolbar>
          <Button appearance="primary" onClick={() => { toaster.remove(key); resolve(true); }}>확인</Button>
          <Button appearance="default" onClick={() => { toaster.remove(key); resolve(false); }}>취소</Button>
        </ButtonToolbar>
      </Notification>
    );

    key = toaster.push(message, { placement: 'topCenter' });
  });
}

// url : 컴포넌트를 선언한 곳(main.Att-regVacaItems.jsx)에서 지정한 url 주소를 받음
// columns : columns 를 props로 받아 동적으로 설정할 수 있도록 변경
const VacaItemsTable = ({ data, columns, onReloading }) => {
  const fetchURL = AppConfig.fetch['mytest'];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const deleteVaca = async (v_code, v_name) => {

    // 만약 휴가코드가 없다면 경고창을 반환.
    if (!v_code) {
      showToast("삭제할 항목이 없습니다.", "warning");
      return;
    };

    const isDel = await confirmDelete();

    if (!isDel) {
      showToast("삭제가 취소되었습니다.", "warning");
      return;
    }

    try {
      // fetch를 통해 데이터를 서버(백엔드)에서 가져와 vacaList 변수에 저장
      const res = await fetch(`${attURL}/deleteVacaItems/${v_code}`, {
        method: "DELETE",
      });

      console.log(res.status);  // 예: 200, 404, 500. 뭐라고 찍히는지 확인s

      // fetch 는 기본적으로 에러를 던지지 않기 때문에 강제에러 발생시킴(404 가 떠도 응답을 받긴 했으니 성공으로 인식함)
      // 응답 실패인 경우, Error 객체를 생성한 후 강제로 에러 발생시켜 아래쪽 코드로 못가도록 catch 블록으로 강제 이동시킴.
      if (!res.ok) throw new Error("네트워크 오류");

      const result = await res.text();

      if (result === "1") {
        showToast("삭제되었습니다.", "success");
        window.location.reload(); // 추후 fetcher로 대체 가능. remix 에서는 권장x
      } else {
        showToast(`삭제 실패했습니다.\n서버에서 처리하지 못했습니다.`, "error");
      }
    } catch(error) {
      console.error("삭제 중 오류:", error);
      showToast(`삭제 요청 중 오류가 발생했습니다.`, "error");
    }
  };
  

  return (
    <>
      <Table
        autoHeight
        height={500}
        style={{ marginBottom: "24px", minWidth: 910 }}
        data={data ?? []}
        cellBordered
      >
        {/* React.Fragment: 가상 컴포넌트. <></> 와 같은 역할임. key 객체를 쓰기 위해서 가상컴포넌트를 사용함. */}
        {columns
          .filter(col => !["v_start", "v_end"].includes(col.dataKey)) // 기존 start, end 컬럼 제거
          .map(col => {
            const isFlexible = ["v_note"].includes(col.dataKey); // 💡 긴 컬럼 조건

            return (
              <React.Fragment key={col.dataKey}>
                <Column
                  key={col.dataKey}
                  {...(isFlexible ? { flexGrow: 1 } : { width: col.width })}
                  className="text_center"
                >
                  <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>
                    {col.label}
                  </HeaderCell>

                  {isFlexible ? (
                    // ✅ 긴 텍스트 칼럼은 말줄임 처리 + 툴팁
                    <Cell>
                      {(rowData) => {
                        const text = rowData[col.dataKey] || "";
                        return (
                          <span
                            title={text}
                            className="text_left"
                            style={{
                              display: "inline-block",
                              width: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              paddingLeft: "8px",
                            }}
                          >
                            {text}
                          </span>
                        );
                      }}
                    </Cell>
                  ) : (
                    <Cell dataKey={col.dataKey} />
                  )}
                </Column>

                {/* ✅ '휴가명' 뒤에만 휴가기간 컬럼 끼워넣기 */}
                {col.dataKey === "v_name" && (
                  <Column width={250} className="text_center">
                    <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>휴가기간</HeaderCell>
                    <Cell>
                      {(rowData) => `${rowData.v_start} ~ ${rowData.v_end}`}
                    </Cell>
                  </Column>
                )}
              </React.Fragment>
            );
          })}

        <Column width={110} className="text_center">
          <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>작업</HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                <Btn text="수정" color="blue" style={{ marginRight: "5px" }}
                   onClick={() => {setEditingRow(rowData); setIsModalOpen(true);}} />
                <Btn text="삭제" color="red" onClick={() => deleteVaca(rowData.v_code, rowData.v_name)} />
              </>
            )}
          </Cell>
        </Column>
      </Table>

      <VacaUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingRow={editingRow}
        onReloading={onReloading}
      />
    </>
  );
};

export default VacaItemsTable;
