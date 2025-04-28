/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Panel } from "rsuite";
import AppConfig from "#config/AppConfig.json";

export default function WeatherInfo() {
  const fetchURL = AppConfig.fetch['mytest'];
  const weatherURL = `${fetchURL.protocol}${fetchURL.url}/api/weather`;

  const openWeatherKey = "7467d489fb6b46f917ab3607d4d3e4bc"; // OpenWeatherKey (필요시)
  const kakaoApiKey = "bfc65c632ea0d4e365653cf4a0e2c427";   // Kakao REST API 키

  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // ✅ 오늘 날씨 가져오기
        const weatherRes = await fetch(`${weatherURL}/today`);
        const weatherData = await weatherRes.json();
        console.log("✅ 날씨 데이터:", weatherData);

        if (weatherData.cod === 200) {
          setWeather(weatherData);

          const { lat, lon } = weatherData.coord;

          // ✅ 카카오 주소 변환 호출
          const kakaoRes = await fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&limit=1`,
            {
              headers: {
                Authorization: `KakaoAK ${kakaoApiKey}`,
            },
          });
          const kakaoData = await kakaoRes.json();
          console.log("✅ 카카오 주소 데이터:", kakaoData);

          if (kakaoData.documents?.length > 0) {
            const address = kakaoData.documents[0].address;
            const fullAddress = `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`;
            setLocation(fullAddress);
          } else {
            setLocation(weatherData.name); // 주소 없으면 기본 도시명
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("⛔ 데이터 가져오기 실패:", err);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // ✅ 렌더링
  if (loading) return <div>날씨 정보를 불러오는 중...</div>;
  if (!weather || weather.cod !== 200) return <div>오늘 날씨 정보를 가져올 수 없습니다.</div>;

  return (
    <Panel bordered header="오늘의 날씨" style={{ maxWidth: 200 }}>
      <p>📍 지역: {location || weather.name}</p>
      <p>🌡️ 온도: {weather.main.temp}°C</p>
      <p>💧 습도: {weather.main.humidity}%</p>
      <p>🌂 날씨: {weather.weather[0].description}</p>
    </Panel>
  );
}
