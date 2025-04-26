import React, { createContext, useContext } from 'react';
import { toaster, Message } from 'rsuite';

const ToastContext = createContext({
  showToast: (message, type) => {},
});

// ToastProvider 컴포넌트
export default function ToastProvider({ children }) {
  const showToast = (message, type = 'info') => {
    toaster.push(
      <Message showIcon type={type} closable duration={1000}>
        {message}
      </Message>,
      { placement: 'topCenter' }
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// 커스텀 훅 (다른 컴포넌트에서 사용)
export const useToast = () => useContext(ToastContext);
