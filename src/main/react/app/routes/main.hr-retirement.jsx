/* eslint-disable react/react-in-jsx-scope */
import MessageBox from "#components/common/MessageBox";
import { Container, Tabs } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import RetiTable from "#components/hr/RetiTable.jsx";
import { useEffect, useState } from "react";

export function meta() {
  return [
      { title: `${AppConfig.meta.title} : 인사관리` },
      { name: "description", content: "인사관리: 퇴직관리 페이지" },
  ];
};

export default function HrRetirement() {
  const fetchURL = AppConfig.fetch['mytest'];
  const hrURL = `${fetchURL.protocol}${fetchURL.url}/hr`;

	// 로그인 시 저장해둔 사용자 직위를 가져오고, 관리자급 직위로만 다시 나누기
	const position = localStorage.getItem("e_position");  // 예: '관리자' 또는 '사원'
	const adminPositions = ["과장", "부장", "차장", "팀장", "이사", "관리"];

  const [e_id, setEid] = useState(null);
  useEffect(() => {
    const stored = Number(localStorage.getItem("e_id"));
    if (stored > 0) setEid(stored);
  }, []);

  // 테이블에 들어갈 항목들의 제목을 미리 정해둔다.
  const retiColumns = [
    { label: "사원번호", dataKey: "e_id", width: 70 },
    { label: "사원명", dataKey: "e_name", width: 80 },
    { label: "부서", dataKey: "d_name", width: 90 },
    { label: "직위", dataKey: "e_position", width: 50 },
    { label: "퇴사유형", dataKey: "re_type", width: 80 },
    { label: "퇴사신청일", dataKey: "re_app_date", width: 100},
    { label: "퇴사예정일", dataKey: "re_date", width: 100 },
    { label: "마지막 근무일", dataKey: "re_last_working_date", width: 100 },
    { label: "결재처리날짜", dataKey: "re_approval_date", width: 100 },
    { label: "퇴직신청상태", dataKey: "re_apply_status", width: 100 },
    { label: "인수인계 여부", dataKey: "re_succession_yn", width: 100 },
    { label: "승인상태", dataKey: "re_approval_status", width: 80 },
    { label: "반려사유", dataKey: "re_reject_reason", width: 190 },
    { label: "결재 사유", dataKey: "re_note", width: 210 },
  ];

  return (
    <Container>
      <MessageBox text="퇴직 관리" />
      
      {/* 직위가 관리자급이면 퇴직 전체 조회, 그 외의 직위라면 본인의 신청 이력만 조회 가능 */}
      {adminPositions.includes(position?.trim()) ? (      // === : 값과 타입 모두 비교. position이 문자열일 때 .trim()을 적용
        <RetiTable url={`${hrURL}/hrRetirementList`} retiColumns={retiColumns} />
      ) : (e_id && (
        <RetiTable url={`${hrURL}/hrRetirementListByEid/${e_id}`} retiColumns={retiColumns} hrURL={hrURL} e_id={e_id} />
      ))}
    </Container>
  );
}
