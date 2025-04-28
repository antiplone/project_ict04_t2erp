// routes/main/schedule.jsx
/* eslint-disable react/react-in-jsx-scope */
import { Container } from "rsuite";
import MessageBox from "#components/common/MessageBox";
import AppConfig from "#config/AppConfig.json";
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
        <Calendar />
      </div>
    </Container>
  );
}
