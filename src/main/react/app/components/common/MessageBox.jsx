/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Message } from "rsuite";

// props로 type,text 전달. type을 생략하고 text만 작성하면 기본값인 "info"가 적용된다.
// 사용예시) <MessageBox type="info" text="제목입니다" /> 또는 <MessageBox type="warning" text="주의가 필요한 항목입니다!" />
export default function MessageBox({ type="info", text }) {
  return (
    <Message type={type} style={{fontSize: 16, fontWeight: "500" }} className="main_title">
      <strong>{text}</strong>
    </Message>
  );
};
