/* eslint-disable react/react-in-jsx-scope */
import { toaster, Notification, ButtonToolbar, Button } from 'rsuite';
import React from 'react';  // JSX 쓰기 위해 필요

// 기본 텍스트 알림
// 사용예시1) showToast("삭제가 취소되었습니다.", "info");
// 사용예시2) showToast("삭제할 항목이 없습니다.", "error");
export function showToast(message, type = 'info', header = '알림') {
  toaster.push(
    <Notification type={type} header={header} closable>
      {message}
    </Notification>,
    { placement: 'topCenter' }
  );
}

// 확인/취소 버튼 포함 커스텀 알림
/* 사용예시) 
showConfirmToast({
  message: "정말 삭제하시겠습니까?",
  type: "warning",
  header: "삭제 확인",
  onConfirm: () => {
    console.log("삭제 실행됨");
    - 여기서 fetch나 실제 동작 넣으면 됩니다. -
  },
  onCancel: () => {
    console.log("취소됨");
  }
});
*/
export function showConfirmToast({
  message,
  type = 'info',
  header = '확인',
  onConfirm = () => {},
  onCancel = () => {}
}) {
  const key = toaster.push(
    <Notification type={type} header={header} closable>
      <p>{message}</p>
      <hr />
      <ButtonToolbar>
        <Button
          appearance="primary"
          onClick={() => {
            onConfirm();      // 외부 함수 실행
            toaster.remove(key); // 해당 토스트만 제거
          }}
        >
          확인
        </Button>
        <Button
          appearance="default"
          onClick={() => {
            onCancel();       // 외부 함수 실행
            toaster.remove(key); // 해당 토스트만 제거
          }}
        >
          취소
        </Button>
      </ButtonToolbar>
    </Notification>,
    { placement: 'topCenter' }
  );
}