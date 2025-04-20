/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Link } from "@remix-run/react";
import { useState } from "react";
import { HStack, Nav, Sidebar, Sidenav, Stack, Text } from "rsuite";
import "rsuite/Sidebar/styles/index.css";

const SideMenu_hr = () => {
	
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
            <Nav.Item eventKey="1" as={Link} to="/main/hr_emp_card" style={{ fontWeight: "500" }}>인사카드등록</Nav.Item>
            <Nav.Item eventKey="2-1" as={Link} to="/main/hr_appointment">인사발령 관리</Nav.Item>	{/* 스타일 깨짐 방지를 위해 as 속성 사용함 */}
            <Nav.Item eventKey="1" as={Link} to="/main/hr_department" style={{ fontWeight: "500" }}>부서관리</Nav.Item>
            <Nav.Item eventKey="3" as={Link} to="/main/hr_retirement" style={{ fontWeight: "500" }}>퇴직관리</Nav.Item>
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

export default SideMenu_hr;
