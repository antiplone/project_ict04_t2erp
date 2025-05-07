// UTC로 저장된 날짜를 한국 시간 YYYY-MM-DD 형식으로 변환
export function formatDate(input) {
    const date = new Date(input);                            // 문자열을 Date 객체로 변환
    if (isNaN(date)) return "-";                             // 유효하지 않은 날짜면 "-"
    const offset = date.getTimezoneOffset() * 60000;         // 내 컴퓨터가 UTC와 몇 분 차이 나는지 알려주는 함수
    const localTime = new Date(date.getTime() - offset);     // 실제 한국 시간 계산
    return localTime.toISOString().split("T")[0];            // "YYYY-MM-DD" 형식으로 반환, 날짜만 필요하기 때문에 T기준으로 자른다다
  }
  
  // 한국은 UTC보다 9시간 빠르기 떄문에 -540분 
  // JavaScrpit에서는 Date를 ms 단위로 시간 계산하기 때문에 * 60000
  // 1분 = 60초 × 1000ms = 60,000ms