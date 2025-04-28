package com.spring.erp_ordit.service.api;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

import org.json.JSONArray;			// pom.xml 에 넣어야 보임
import org.json.JSONObject;		// pom.xml 에 넣어야 보임
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.spring.erp_ordit.dao.api.WeatherMapper;
import com.spring.erp_ordit.dto.api.WeatherDTO;

@Service
public class WeatherService {
	
    @Autowired
    private WeatherMapper dao;

    public WeatherDTO fetchAndSaveWeather() {

        // ✅ 인코딩된 인증키 사용
//    	String apiKey = "en8u4mrxbi9oHDPiHl90ti%2BeTiJuyMitAcZ%2FTLGDOygBSC9nS7%2Bg4piESuCaXe%2FCN%2Fd7Y0U2hA7gztwCfOrPLA%3D%3D";
        String apiKey = "en8u4mrxbi9oHDPiHl90ti%2BeTiJuyMitAcZ%2FTLGDOygBSC9nS7%2Bg4piESuCaXe%2FCN%2Fd7Y0U2hA7gztwCfOrPLA%3D%3D";
        String baseDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseTime = getBaseTime(); // 자동 계산

        String nx = "60", ny = "127"; // 서울

        String url = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst")
                .queryParam("serviceKey", apiKey)
                .queryParam("numOfRows", 100)
                .queryParam("pageNo", 1)
                .queryParam("dataType", "JSON")
                .queryParam("base_date", baseDate)
                .queryParam("base_time", "1700")
                .queryParam("nx", nx)
                .queryParam("ny", ny)
//                .build(false)
                .toUriString();

        System.out.println("🔍 날씨 API 요청 URL: " + url);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        System.out.println("📦 날씨 API 응답 원문:\n" + response);

        if (!response.trim().startsWith("{")) {
            throw new RuntimeException("API 응답이 JSON 형식이 아님: " + response);
        }

        // JSON 파싱
        JSONObject obj = new JSONObject(response);
        JSONArray items = obj.getJSONObject("response").getJSONObject("body").getJSONObject("items")
                .getJSONArray("item");

        WeatherDTO dto = new WeatherDTO();
        dto.setWeather_date(baseDate);
        dto.setWeather_time(baseTime);

        for (int i = 0; i < items.length(); i++) {
            JSONObject item = items.getJSONObject(i);
            switch (item.getString("category")) {
                case "TMP":
                    dto.setWeather_temperature(item.getString("fcstValue"));
                    break;
                case "SKY":
                    dto.setWeather_sky(item.getString("fcstValue"));
                    break;
                case "PTY":
                    dto.setWeather_rain_type(item.getString("fcstValue"));
                    break;
            }
        }

        System.out.println("🌡️ 최종 DTO: " + dto);

        // ✅ DB 저장 예외 처리
        try {
            dao.insertWeather(dto);
        } catch (Exception e) {
            System.out.println("❌ DB 저장 실패");
            e.printStackTrace();
            throw new RuntimeException("DB 저장 중 오류 발생");
        }

        return dto;
    }

    // 🔹 가장 가까운 base_time 자동 계산 메서드
    private String getBaseTime() {
        int hour = LocalTime.now().minusHours(1).getHour();
        int[] validTimes = {2, 5, 8, 11, 14, 17, 20, 23};
        int closest = Arrays.stream(validTimes).filter(t -> t <= hour).max().orElse(23);
        return String.format("%02d00", closest);
    }

    public WeatherDTO getLatestWeather() {
        return dao.selectLatestWeather();
    }
}