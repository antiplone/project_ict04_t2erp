// routes/main/schedule.jsx
/* eslint-disable react/react-in-jsx-scope */
import { Container } from "rsuite";
import HolidayCalendar from "#components/api/HolidayCalendar";
import HolidayCalendar3 from "#components/api/HolidayCalendar3";
import HolidayCalendar5 from "#components/api/HolidayCalendar5";
import MessageBox from "#components/common/MessageBox";
import AppConfig from "#config/AppConfig.json";
import WeatherBox from "#components/api/WeatherBox.jsx";
import WeatherInfo from "#components/api/WeatherInfo.jsx";
import Calendar from "#components/api/Calendar.jsx";

export function meta() {
  return [
    { title: `${AppConfig.meta.title} : 일정` },
    { name: "description", content: "공휴일 달력 페이지" },
  ];
}

export default function SchedulePage() {
  return (
    <Container>
      <MessageBox text="공휴일 일정" />
      <div style={{ marginTop: "20px" }}>
        {/* <HolidayCalendar5 /> */}
        {/* <HolidayCalendar /> */}
        {/* <HolidayCalendar3 /> */}
      </div>
      <Calendar />
    </Container>
  );
}
