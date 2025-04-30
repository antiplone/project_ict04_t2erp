/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Button, ButtonToolbar, Notification, Table, toaster } from "rsuite";
import AttUpdateModal from "./AttUpdateModal";
import AppConfig from "#config/AppConfig.json";
import Btn from "./Btn";
import { useToast } from '#components/common/ToastProvider';  // 경고창
import "#styles/common.css";

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

// url : 컴포넌트를 선언한 곳(main.Att-regAttItems.jsx)에서 지정한 url 주소를 받음
// columns : columns 를 props로 받아 동적으로 설정할 수 있도록 변경
export default function AttItemsTable({ data, columns, onReloading }) {
  const fetchURL = AppConfig.fetch['mytest'];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const deleteAtt = async (a_code) => {

    // 만약 근태코드가 없다면 경고창을 반환.
    if (!a_code) {
      showToast("삭제할 항목이 없습니다.", "warning");
      return;
    };
    
    const isDel = await confirmDelete();

    if (!isDel) {
      showToast("삭제가 취소되었습니다.", "warning");
      return;
    }

    try {
      // fetch를 통해 데이터를 서버(백엔드)에서 가져와 attList 변수에 저장
      const res = await fetch(`${attURL}/deleteAttItems/${a_code}`, {
        method: "DELETE",
      });

      console.log(res.status);  // 예: 200, 404, 500. 뭐라고 찍히는지 확인s

      // fetch 는 기본적으로 에러를 던지지 않기 때문에 강제에러 발생시킴(404 가 떠도 응답을 받긴 했으니 성공으로 인식함)
      // 응답 실패인 경우, Error 객체를 생성한 후 강제로 에러 발생시켜 아래쪽 코드로 못가도록 catch 블록으로 강제 이동시킴.
      if (!res.ok) throw new Error("네트워크 오류");

      const result = await res.text();

      if (result === "1") {
        showToast(`삭제되었습니다.`, "success");
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
        style={{ marginBottom: "24px", minWidth: "600px" }}
        data={data ?? []}
        cellBordered
      >
        {columns.map(col => (
          <Column key={col.dataKey} width={col.width} className="text_center">
            <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>{col.label}</HeaderCell>
            <Cell dataKey={col.dataKey} />
          </Column>
        ))}

        <Column width={110} className="text_center">
          <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>작업</HeaderCell>
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
