import brand from "#images/common/brand.png";
import backImg from "#images/common/back.png";
import rightImg from "#images/common/right.png";

import "rsuite/Sidebar/styles/index.css";

import { useState } from "react";
import { HStack, Button, Nav, Sidebar, Sidenav, Stack, Text } from "rsuite";

import ToImage from "#components/res/ToImage";


const SideMenu = () => {

	const [expand, setExpand] = useState(true);

	return (
		<Sidebar
			style={{ display: "flex", flexDirection: "column" }}
			width={expand ? 232 : 56}
			collapsible
		>
			<Sidenav.Header>
				<Brand expand={expand} />
			</Sidenav.Header>
			<Sidenav
				expanded={expand}
				defaultOpenKeys={["3"]}
				appearance="subtle"
			>
				<Sidenav.Body>
					<Nav defaultActiveKey="1">
						<Nav.Item eventKey="1">
							<Text>대시보드</Text>
						</Nav.Item>
						<Nav.Item
							eventKey="2"
						>
							부서연결
						</Nav.Item>
						<Nav.Menu
							eventKey="3"
							trigger="hover"
							title="고급"
							placement="rightStart"
						>
							<Nav.Item eventKey="3-1">Geo</Nav.Item>
							<Nav.Item eventKey="3-2">Devices</Nav.Item>
							<Nav.Item eventKey="3-3">Brand</Nav.Item>
							<Nav.Item eventKey="3-4">Loyalty</Nav.Item>
							<Nav.Item eventKey="3-5">Visit Depth</Nav.Item>
						</Nav.Menu>
						<Nav.Menu
							eventKey="4"
							trigger="hover"
							title="설정"
							placement="rightStart"
						>
							<Nav.Item eventKey="4-1">Applications</Nav.Item>
							<Nav.Item eventKey="4-2">Websites</Nav.Item>
							<Nav.Item eventKey="4-3">Channels</Nav.Item>
							<Nav.Item eventKey="4-4">Tags</Nav.Item>
							<Nav.Item eventKey="4-5">Versions</Nav.Item>
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
		<Stack
			className="nav-toggle"
			justifyContent={expand ? "flex-end" : "center"}
		>
			<Button appearance="subtle" onClick={onChange}>
				{expand ? <ToImage src={backImg} width={24} height={24} /> : <ToImage src={rightImg} width={24} height={24} />}
			</Button>
		</Stack>
	);
};

const Brand = ({ expand }) => {
	return (
		<HStack
			style={{ margin: 8 }}
			className="page-brand"
			justifyContent={"center"}
			spacing={12}
		>
			<ToImage src={brand} width={32} height={32} />
			{expand && <Text size={24}>Ordit</Text>}
		</HStack>
	);
};


export default SideMenu;
