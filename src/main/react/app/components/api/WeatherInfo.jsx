/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Panel } from "rsuite";
import AppConfig from "#config/AppConfig.json";

export default function WeatherInfo() {
  const fetchURL = AppConfig.fetch['mytest'];
  const weatherURL = `${fetchURL.protocol}${fetchURL.url}/api/weather`;

  // 상태 변수
  const [weather, setWeather] = useState(null);     // 받아온 날씨 데이터를 저장할 공간
  const [location, setLocation] = useState("");     // 지역명을 저장할 공간
  const [isLoading, setIsLoading] = useState(true);	// 데이터를 가져오는 중인지 표시 (true/false)
  const [error, setError] = useState("");           // 에러 메세지를 저장하는 공간

  const cityNameMap = {   // 도시 이름 변환 테이블
    Seoul: "서울특별시",
    Busan: "부산광역시",
    Daegu: "대구광역시",
    Incheon: "인천광역시",
    Gwangju: "광주광역시",
    Daejeon: "대전광역시",
    Ulsan: "울산광역시",
    Sejong: "세종특별자치시",
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 오늘 날씨 데이터를 요청 후 응답 받아서 JSON 형태로 변환
        const weatherRes = await fetch(`${weatherURL}/today`);
        const weatherData = await weatherRes.json();
        console.log("날씨 데이터:", weatherData);

        // 서버가 제대로 응답했는지 확인
        if (weatherData.cod !== 200) {
          throw new Error("날씨 정보를 정상적으로 가져오지 못했습니다.");
        }
        // 잘 응답했다면, 값 저장
        setWeather(weatherData);
    
        // 도시명을 한국어로 변환
        const rawCityName = weatherData.name;
        const korCityName = cityNameMap[rawCityName] || rawCityName; // 없으면 원본 이름 사용
        setLocation(korCityName);
    
      } catch (err) {   // 에러 처리
        console.error("데이터 가져오기 실패:", err);
        setError(err.message || "날씨 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {       // 무조건 로딩 상태를 false로 바꿔서 "완료" 표시
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, []);

  // 렌더링
  // 성공이면 데이터를 가져오는 동안에는 "불러오는 중"을 표시, 실패라면 "날씨 정보를 가져올 수 없습니다"를 표시
  if (isLoading) return <div>날씨 정보를 불러오는 중...</div>;
  if (!weather || weather.cod !== 200) return <div>오늘 날씨 정보를 가져올 수 없습니다.</div>;

  return (
    <Panel bordered header="오늘의 날씨" style={{ maxWidth: 200 }}>
      {/* main: 기온 관련 정보를 담는 객체
        weather[0]: 날씨 정보가 하나 이상이 올 수 있기 때문에, 첫 번째 항목을 선택해서 처리 */}
      <p>📍 지역: {location}</p>
      <p>🌡️ 온도: {weather.main.temp}°C</p>
      <p>💧 습도: {weather.main.humidity}%</p>
      <p>🌂 날씨: {weather.weather[0].description}</p>
    </Panel>
  );
}
