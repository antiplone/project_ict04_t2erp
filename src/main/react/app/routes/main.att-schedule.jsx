/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Container, Loader, Placeholder } from "rsuite";
import MessageBox from "#components/common/MessageBox";
import AppConfig from "#config/AppConfig.json";
// import Calendar from "#components/api/calendar/Calendar";
import HolidayCalendar from "#components/api/calendar/HolidayCalendar";
import HolidayCalendars from "#components/api/calendar/HolidayCalendars.jsx";

export function meta() {
  return [
    { title: `${AppConfig.meta.title} : 일정` },
    { name: "description", content: "공휴일 달력 페이지" },
  ];
}

export default function SchedulePage() {
  const [isLoading, setIsLoading] = useState(true);	// 데이터를 가져오는 중인지 표시 (true/false)

  // 로딩 해제 (1초 후)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <MessageBox text="일정 관리" />

        {/* 로딩 중일 때 */}
        {isLoading ? (
          <>
            <Placeholder.Paragraph rows={16} />
            <Loader center content="불러오는 중..." />
          </>
        ) : (
        // 로딩 후 달력 표시
        <div style={{ marginTop: "20px" }}>
          {/* <HolidayCalendar /> */}
          <HolidayCalendars />
        </div>
      )}
    </Container>
  );
}
