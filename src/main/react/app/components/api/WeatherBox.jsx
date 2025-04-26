/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Message, useToaster } from "rsuite";
import AppConfig from "#config/AppConfig.json";

function getSkyLabel(code) {
  switch (code) {
    case "1": return "맑음";
    case "3": return "구름 많음";
    case "4": return "흐림";
    default: return "정보 없음";
  }
};

function getRainLabel(code) {
  switch (code) {
    case "1": return "비";
    case "2": return "비/눈";
    case "3": return "눈";
    case "0": return "없음";
    default: return "정보 없음";
  }
};

export default function WeatherBox() {
  const fetchURL = AppConfig.fetch['mytest'];
  const weatherURL = `${fetchURL.protocol}${fetchURL.url}/api/weather`;

  const [loading, setLoading] = useState(true); // 로딩 상태변수
  const [error, setError] = useState(null);     // 에러 상태변수

  const [weather, setWeather] = useState(null);
  const toaster = useToaster();

  useEffect(() => {
    fetch(`${weatherURL}/latest`)
      .then(async (res) => {
        // 먼저 서버응답이 잘 되는지 확인.
        if (!res.ok) throw new Error("서버 응답 실패: " + res.status);
        
        // 현재 fetch 응답이 JSON 파싱을 시도하고 있는데, 만약 응답이 JSON이 아닌 XML일 경우를 대비하여 설정한다.
        const text = await res.text();
        if (!text) throw new Error("빈 응답입니다.");
        
        try {
          const json = JSON.parse(text);
          return json;
        } catch(e) {
          throw new Error("응답이 JSON 형식이 아닙니다.")
        };
      })
      .then((data) => {
        if (!data) return;

        const temp = data.weather_temperature;
        const sky = getSkyLabel(data.weather_sky);
        const rain = getRainLabel(data.weather_rain_type);

        const content = (
          <Message showIcon type="info" header="📍 오늘의 날씨 알림" closable>
            🌡️ 온도: {temp}℃ <br />
            ☁️ 하늘 상태: {sky} <br />
            🌧️ 강수: {rain}
          </Message>
        );
        
        console.log("🌦️ 날씨 응답 데이터:", data);

        toaster.push(content, { placement: "topEnd", duration: 8000 });
        setWeather({ temp, sky, rain });
        setLoading(false);   // <- 여기서 로딩 끝 처리
      })
      .catch((err) => {
        console.error("💥 날씨 API 오류:", err.message);
        setError(err.message);  // <- 오류 메시지 저장
        setLoading(false);      // <- 로딩 중단 처리
      });
  }, [weatherURL]);

  // 만약 날씨 정보를 불러오지 못했다면
  if (error) return <p>⚠️ 날씨 정보를 불러오지 못했습니다: {error}</p>;

  // 만약 페이지가 로딩중이라면
  if (loading) return <p>🌤️ 날씨 정보를 불러오는 중...</p>;

  return weather ? (
    <div className="weather-box">
      <h5>📍 오늘의 날씨</h5>
      <p>🌡️ {weather.temp}℃</p>
      <p>☁️ {weather.sky}</p>
      <p>🌧️ {weather.rain}</p>
    </div>
  ) : null;
  // return null; // 자동 알림이므로 따로 UI 안 띄움
}
