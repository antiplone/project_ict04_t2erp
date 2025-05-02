/* eslint-disable react/prop-types */
import React from 'react';
import { Button, ButtonToolbar, Message  } from 'rsuite';
import { useToast } from "#components/common/ToastProvider";

const HrButton = ({ hrBtn, onClick }) => {
  return (
    <ButtonToolbar style={{ padding: '20px 0 10px', display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        appearance="ghost"
        size="md" style={{ marginRight:"15px"}}
        onClick={onClick} // 버튼 클릭 시 onClick 함수 호출
      >
        {hrBtn}
      </Button>
    </ButtonToolbar>
  );
};

export default HrButton;

export function CheckButton({ bizNum, onResult }) {
  const { showToast } = useToast();

  const handleCheck = async () => {
    if (!bizNum.trim()) {
      showToast('사업자등록번호를 입력해주세요.', 'warning');
      onResult(false);
      return;
    }

    const bizNumPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!bizNumPattern.test(bizNum)) {
      showToast('사업자등록번호 형식이 올바르지 않습니다. (예: 123-45-67890)', 'warning');
      onResult(false);
      return;
    }

    try {
      const fetchURL = "http://localhost:8081";  // 서버 주소
      const res = await fetch(`${fetchURL}/basic/bizNumCheck/${bizNum}`, {
        method: "GET"
      });

      if (!res.ok) {
        throw new Error('서버 응답 실패');
      }

      const result = await res.text();  // 서버에서 온 응답 (0 또는 1)

      if (result !== "0") {
        showToast('이미 등록된 사업자등록번호입니다.', 'warning');
        onResult(false);
      } else {
        showToast('등록 가능한 사업자등록번호입니다.', 'success');
        onResult(true);
      }
    } catch (error) {
      console.error('중복확인 에러:', error);
      showToast('서버 오류가 발생했습니다.', 'error');
      onResult(false);
    }
  };

  return (
    <Button 
      appearance="ghost" 
      size="xs" 
      onClick={handleCheck}
      style={{ marginLeft: 10 }}
    >
      중복확인
    </Button>
  );
}

