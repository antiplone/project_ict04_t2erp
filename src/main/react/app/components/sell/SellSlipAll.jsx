import React, { useRef, useState, useEffect } from 'react';

// print-js를 전역에서 사용할 수 있도록 변수 선언(초기에는 undefined)
let printJS;


// react-to-print : 리액트 프린트하는 라이브러리이나, CommonJS 방식으로 배포된 라이브러리로
// type: "module" 환경 (즉, ESM 전용 환경)이라 사용 불가(Remix는 SSR까지 겹치니까 window, document, ref 관련 에러도 터짐)
// 즉, react-to-print는 기본적으로 Vite + ESM + SSR 조합에 잘 안 맞는 구조

// print-js + SSR-safe dynamic import 으로 프린트 기능 진행
const SellSlipAll = () => {
  // 인쇄할 DOM 요소에 접근하기 위해 useRef 사용
  const printRef = useRef();

  // 클라이언트 사이드 여부를 판단하기 위한 상태값
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 오류 방지를 위해 조건문 사용
    if (typeof window !== 'undefined') {
      import('print-js').then((module) => {
        printJS = module.default;
        setIsClient(true);
      });
    }
  }, []);

  const handlePrint = () => {
    if (printJS && printRef.current) {
      printJS({
        printable: printRef.current.innerHTML,
        type: 'raw-html',
        style: `
          h1 { color: black; font-size: 20px; }
          p { font-size: 14px; }
        `
      });
    }
  };

  return (
    <div>
      
      <div ref={printRef}>
        <h1>판매전표</h1>
        <p>인쇄할 내용입니다.</p>
      </div>
      
      {isClient && <button onClick={handlePrint}>프린트</button>}
    </div>
  );
};

export default SellSlipAll;