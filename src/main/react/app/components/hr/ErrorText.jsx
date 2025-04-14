import React from 'react';
import PropTypes from 'prop-types';

// 에러 메시지를 빨간 글씨로 보여주는 컴포넌트
export default function ErrorText({ message }) {
  if (!message) return null;  // 메시지가 없으면 아무것도 렌더링하지 않음

  return (
    <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
      {message}
    </div>
  );
}

ErrorText.propTypes = {
    message: PropTypes.string,
  };
