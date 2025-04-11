/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Link } from "@remix-run/react";
import { useState } from "react";
import { HStack, Nav, Sidebar, Sidenav, Stack, Text } from "rsuite";
import "rsuite/Sidebar/styles/index.css";

const AttSideMenu = () => {
	
  const [expand, setExpand] = useState(true);

  return (
    <Sidebar
      style={{ margin: 0, display: "flex", flexDirection: "column" }}
      width={expand ? 260 : 56}
      collapsible
    >
      <Sidenav.Header>
        <Brand expand={expand} />
      </Sidenav.Header>
      <Sidenav expanded={expand} defaultOpenKeys={["1"]} appearance="subtle">
        <Sidenav.Body>
          <Nav defaultActiveKey="1" align="left">
            <Nav.Menu eventKey="1" trigger="hover" title="기본항목등록" placement="rightStart" style={{ fontWeight: "500" }}>
              <Nav.Item eventKey="1-1" as={Link} to="/main/att_regAttItems">근태항목등록</Nav.Item>	{/* 스타일 깨짐 방지를 위해 as 속성 사용함 */}
              <Nav.Item eventKey="1-2" as={Link} to="/main/att_regVacaItems">휴가항목등록</Nav.Item>
            </Nav.Menu>
            <Nav.Menu eventKey="2" trigger="hover" title="근태" placement="rightStart" style={{ fontWeight: "500" }}>
              <Nav.Item eventKey="2-1" as={Link} to="/main/att_attendance">근태</Nav.Item>
              <Nav.Item eventKey="2-2" as={Link} to="/main/att_attendanceList">근태현황</Nav.Item>
            </Nav.Menu>
            <Nav.Menu eventKey="3" trigger="hover" title="출/퇴근" placement="rightStart" style={{ fontWeight: "500" }}>
              <Nav.Item eventKey="3-1" as={Link} to="/main/att_commuRecords">출/퇴근반영기준</Nav.Item>
              <Nav.Item eventKey="3-3" as={Link} to="/main/att_commuStatus">출/퇴근현황</Nav.Item>
              <Nav.Item eventKey="3-4" as={Link} to="/main/att_commuLate">지각현황</Nav.Item>
              <Nav.Item eventKey="3-5" as={Link} to="/main/att_commuAttStatus">출퇴근/근태현황</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
      <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
    </Sidebar>
  );
};

const NavToggle = ({ expand, onChange }) => {
  return (
    <Stack className="nav-toggle" justifyContent={expand ? "flex-end" : "center"}>
      {/* <IconButton
        onClick={onChange}
        appearance="subtle"
        size="lg"
        // icon={expand ? <ArrowLeftLine /> : <ArrowRightLine />}
      /> */}
    </Stack>
  );
};

const Brand = ({ expand }) => {
  return (
    <HStack style={{ margin: 8 }} className="page-brand" justifyContent={"center"} spacing={12}>
      {expand && <Text size={24}>Ordit</Text>}
    </HStack>
  );
};

export default AttSideMenu;
