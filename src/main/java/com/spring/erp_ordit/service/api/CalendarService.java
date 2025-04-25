package com.spring.erp_ordit.service.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.net.URL;		// 수기로 작성

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring.erp_ordit.dto.api.CalendarDTO;

@Service
public class CalendarService {

    // year -> List<CalendarDTO>
    private final Map<String, List<CalendarDTO>> holidayCache = new HashMap<>();
    
	// 외부 공공데이터 API를 호출하고 JSON → DTO로 변환하는 로직 담당.
    public List<CalendarDTO> getAllEvents(String year, String month) {
//        List<CalendarDTO> events = new ArrayList<>();
//        
//        try {
//            String apiKey = "en8u4mrxbi9oHDPiHl90ti%2BeTiJuyMitAcZ%2FTLGDOygBSC9nS7%2Bg4piESuCaXe%2FCN%2Fd7Y0U2hA7gztwCfOrPLA%3D%3D";	// 인코딩 Key
//            String urlStr = String.format(
//                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=%s&solMonth=%s&_type=json&ServiceKey=%s",
//                year, String.format("%02d", Integer.parseInt(month)), apiKey);
//
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode root = mapper.readTree(new URL(urlStr));
//            JsonNode items = root.path("response").path("body").path("items").path("item");
//
//            if (items.isArray()) {
//                for (JsonNode item : items) {
//                    String dateName = item.path("dateName").asText();
//                    String locdate = item.path("locdate").asText();
//                    String formattedDate = locdate.replaceAll("(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3");
//                    events.add(new CalendarDTO(dateName, formattedDate, true));
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    return events;
        String key = year;

        // ✅ 캐시가 있다면 반환
        if (holidayCache.containsKey(key)) {
            return holidayCache.get(key).stream()
                .filter(dto -> dto.getStart().startsWith(year + "-" + String.format("%02d", Integer.parseInt(month))))
                .toList();
        }

        // ✅ 없다면 1년치 한 번에 API로 호출
        List<CalendarDTO> fullYearEvents = new ArrayList<>();

        for (int m = 1; m <= 12; m++) {
            try {
                String apiKey = "en8u4mrxbi9oHDPiHl90ti%2BeTiJuyMitAcZ%2FTLGDOygBSC9nS7%2Bg4piESuCaXe%2FCN%2Fd7Y0U2hA7gztwCfOrPLA%3D%3D";
                String urlStr = String.format(
                    "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=%s&solMonth=%02d&_type=json&ServiceKey=%s",
                    year, m, apiKey
                );

                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(new URL(urlStr));
                JsonNode items = root.path("response").path("body").path("items").path("item");

                if (items.isArray()) {
                    for (JsonNode item : items) {
                        String dateName = item.path("dateName").asText();
                        String locdate = item.path("locdate").asText();
                        String formattedDate = locdate.replaceAll("(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3");
                        fullYearEvents.add(new CalendarDTO(dateName, formattedDate, true));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // ✅ 캐시 저장
        holidayCache.put(year, fullYearEvents);

        // 요청한 월만 필터링
        return fullYearEvents.stream()
            .filter(dto -> dto.getStart().startsWith(year + "-" + String.format("%02d", Integer.parseInt(month))))
            .toList();
    }
}
