/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";

export default function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1초마다 업데이트되는 시계
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);      // 언마운트 시 정리
  }, []);

  // 년월일로 표시
  const todayFormatted = currentTime.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeFormatted = currentTime.toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Seoul",
  });

  return (
    <>
      <div style={{ fontSize: "18px", marginTop: 10 }}>{todayFormatted}</div>
      <div style={{ fontSize: "30px", fontWeight: "bold",marginTop: 10 }}>{timeFormatted}</div>
    </>
  );
}
