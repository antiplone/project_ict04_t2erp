/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import RetiAllTab from "#components/hr/RetiAllTab.jsx";
import RetiMyTab from "#components/hr/RetiMyTab.jsx";

export default function RetiTable({ url, retiColumns, hrURL, e_id }) {
  const [retiData, setRetiData] = useState([]); // 전체 퇴직 데이터를 저장하는 상태 변수.

	// 로그인 시 저장해둔 사용자 직위를 가져오고, 관리자급 직위로만 다시 나누기
	const position = localStorage.getItem("e_position");  // 예: '관리자' 또는 '사원'
	const adminPositions = ["대리", "과장", "부장", "차장", "팀장", "이사", "관리"];

  // 인사 관리 - 퇴사자 리스트 값 불러오기(STS4 console창에서 두 번 돌아가지만, 실제 배포일 땐 한 번만 돌아간다고 함)
  useEffect(() => {
    if (!url) return;
    
    fetch(url, { method: "GET" })
    .then(res => res.json())
    .then(res => {
      // console.log("Oh! 잘 들어옵니다^^ ", res);  // 여기까지 잘 오는지 확인용
      setRetiData(res);
      console.log("받은 데이터:", res); // 로그 추가
    })
    .catch(error => {
      console.error("퇴사자 데이터를 불러오지 못했습니다ㅠ => ", error);
      setRetiData([]); // 에러 났을 때도 빈 배열로
    });
  }, [url]);

  if (adminPositions.includes(position?.trim())) {
    return <RetiAllTab retiColumns={retiColumns} retiData={retiData} />;
  } else if (e_id) {
    return <RetiMyTab retiColumns={retiColumns} retiData={retiData} />;
  } else {
    return <div style={{ padding: "20px" }}>로그인이 필요합니다.</div>;
  }
}
