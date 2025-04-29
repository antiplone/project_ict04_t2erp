/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";

export default function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간을 담고있는 상태 변수이다.

  // 1초마다 업데이트되는 시계이다.
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);  // 1초마다 setInterval() 함수를 실행한다.
    return () => clearInterval(timer);  // setInterval()로 만든 타이머는 따로 꺼주지 않으면 메모리 낭비 문제때문에 clearInterval() 함수로 제거한다.
  }, []);

  // todayFormatted 변수에 값을 담아 년월일로 표시
  // currentTime : new Date()로 만든 현재 날짜와 시간 정보가 들어있는 객체이다.
  // currentTime 객체를 사람이 읽기 좋은 형식으로 바꿔주는 게 toLocaleDateString() 함수이다.
  const todayFormatted = currentTime.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeFormatted = currentTime.toLocaleTimeString("ko-KR", {
    hour12: false,            // 24시간으로 보여주도록 설정한다.
    hour: "2-digit",          // 2-digit : 02, 06 이런식으로 두 자리로 나오도록 설정한다.
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Seoul",   // 한국어로 설정한다.
  });

  return (
    <>
      <div style={{ fontSize: "18px", marginTop: 10, letterSpacing: 1 }}>{todayFormatted}</div>
      <div style={{ fontSize: "30px", fontWeight: "bold", marginTop: 10,  letterSpacing: 3 }}>{timeFormatted}</div>
    </>
  );
}

