/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Link } from "@remix-run/react";
import { useState } from "react";
import { HStack, Nav, Sidebar, Sidenav, Stack, Text } from "rsuite";
import "rsuite/Sidebar/styles/index.css";

const SideMenu_attendance = () => {
	
  const [expand, setExpand] = useState(true);

  return (
    <Sidebar
      // style={{ height: "925px", margin: 0, display: "flex", flexDirection: "column", boxShadow: "15px 0px 5px -15px #777" }}
      style={{ height: "925px", margin: 0, display: "flex", flexDirection: "column" }}
      width={expand ? 260 : 56}
      collapsible
    >
      <Sidenav.Header>
        <Brand expand={expand} />
      </Sidenav.Header>
      <Sidenav expanded={expand} defaultOpenKeys={["1"]} appearance="subtle">
        <Sidenav.Body>
          <Nav defaultActiveKey="2" align="left">
            <Nav.Menu eventKey="1" trigger="hover" title="기본 항목 관리" placement="rightStart" style={{ fontWeight: "500" }}>
              <Nav.Item eventKey="1-1" as={Link} to="/main/att-regAttItems">근태 항목 등록</Nav.Item>	{/* 스타일 깨짐 방지를 위해 as 속성 사용함 */}
              <Nav.Item eventKey="1-2" as={Link} to="/main/att-regVacaItems">휴가 항목 등록</Nav.Item>
            </Nav.Menu>
            <Nav.Item eventKey="2" as={Link} to="/main/att_management" style={{ fontWeight: "500" }}>근태관리</Nav.Item>
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
      {expand && <Text size={36} weight="bold">Ordit</Text>}
    </HStack>
  );
};

export default SideMenu_attendance;
