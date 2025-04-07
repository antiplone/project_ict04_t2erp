import React, { useState } from "react";
// import { useLocation } from "react-router-dom";   // 현재 경로를 알수있음
import { Button, Container } from "rsuite";
import AttItemsTable from "#components/attendance/AttItemsTable";
import AttModal from "#components/attendance/AttModal";

export function meta() {
  // 웹 페이지의 정보(메타데이터)를 설정해주는 함수. 즉, 웹페이지의 명함이라 할 수 있음.
  return [
    { title: "근태 항목 등록" },  // title: html에서 쓰는 <title>내용</title> 과 같음
    { name: "Registration of attendance items",
      content: "기본 항목 등록 - 근태 항목 등록 페이지" },  // name, content: html에서 쓰는 <meta name="" content=""> 와 같음
  ];
};

// 아직 정리가 안되었습니다.. 일단 돌아가는지 확인해보려고 넣었습니다.
// @Remix:url(/main/regAttItems)
export default function RegAttItems() {

  // 테이블에 들어갈 항목들의 제목을 미리 정해둔다.
  const columns = [
    { label: "근태코드", dataKey: "a_code", width: 100 },
    { label: "근태명", dataKey: "a_name", width: 150 },
    { label: "근태유형", dataKey: "a_type", width: 100 },
    { label: "사용유무", dataKey: "a_use", width: 100 },
    { label: "비고", dataKey: "a_note", width: 240 },
  ];

  // 모달 상태를 부모에서 관리
  // open이라는 상태 변수를 사용해서 모달이 열렸는지 닫혔는지를 관리함.
  const [open, setOpen] = useState(false);
  const modalOpen = () => {
    // console.log("모달 열기"); // console 창에 modalOpen 함수가 찍히는지 확인.
    setOpen(true);
  };
  const modalClose = () => {
    // console.log("모달 닫기"); // 디버깅 로그
    setOpen(false);
  };

  return (
    <>
      <Container>
        <Container>
          <h5>근태항목등록</h5>
          {/* <SearchItems onSearch={handleSearch}/> */}
        </Container>

        <AttItemsTable
          url={`http://localhost:8081/attendance/regAttItems`}
          columns={columns}
        />
        <Container style={{ display: "flex", flexDirection: "row" }}>
          <Button onClick={modalOpen}>
            추가
          </Button>
        </Container>
        <AttModal open={open} onClose={modalClose} />
        {/* 모달 상태와 닫기 함수를 props로 전달 */}
      </Container>
    </>
  );
};