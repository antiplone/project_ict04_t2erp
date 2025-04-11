/* eslint-disable react/prop-types */
import React from 'react';
import { Button, ButtonToolbar } from 'rsuite';

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
