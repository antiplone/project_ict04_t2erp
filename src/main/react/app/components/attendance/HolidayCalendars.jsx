/* eslint-disable react/react-in-jsx-scope */
import { Calendar } from "rsuite";
import { useEffect, useState } from "react";

export default function HolidayCalendar() {
  const [holidayMap, setHolidayMap] = useState(new Map());

  useEffect(() => {
    const fetchAllHolidays = async () => {
      const year = new Date().getFullYear();
      const apiKey = 'en8u4mrxbi9oHDPiHl90ti%2BeTiJuyMitAcZ%2FTLGDOygBSC9nS7%2Bg4piESuCaXe%2FCN%2Fd7Y0U2hA7gztwCfOrPLA%3D%3D';
      const baseURL = 'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';

      const newMap = new Map();

      // 12개월 반복: for (let month = 1; month <= 12; month++)
      for (let month = 1; month <= 12; month++) {
        const mm = String(month).padStart(2, '0');  // "01" ~ "12"
        const url = `${baseURL}?ServiceKey=${apiKey}&_type=json&solYear=${year}&solMonth=${mm}`;
        try {
          const res = await fetch(url);
          const json = await res.json();
          const items = json.response.body.items?.item;

          if (Array.isArray(items)) {
            items.forEach(item => {
              const d = item.locdate.toString();  // ex: 20250101
              const dateStr = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
              newMap.set(dateStr, item.dateName); // 날짜 => 공휴일 이름
            });
          } else if (items) {
            const d = items.locdate.toString();
            const dateStr = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
            newMap.set(dateStr, items.dateName);
          }

        } catch (e) {
          console.warn(`❌ ${mm}월 휴일 불러오기 실패`, e);
        }
      }

      setHolidayMap(newMap);
    };

    fetchAllHolidays();
  }, []);

  const renderCell = (date) => {
    const dateStr = date.toISOString().split("T")[0]; // yyyy-MM-dd
    if (holidayMap.has(dateStr)) {
      return (
        <div style={{ backgroundColor: '#e74c3c', color: 'white', padding: '4px', borderRadius: '6px' }}>
          <div style={{ fontSize: '16px' }}>{date.getDate()}</div>
          <div style={{ fontSize: '10px', color: '#eee' }}>{holidayMap.get(dateStr)}</div>
        </div>
      );
    }
    return null;
  };

  return <Calendar renderCell={renderCell} />;
}
