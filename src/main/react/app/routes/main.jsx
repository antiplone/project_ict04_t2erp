/* eslint-disable react/react-in-jsx-scope */
import { Outlet, useLocation } from "@remix-run/react";
import { Container, Content } from "rsuite";

import AppConfig from "#config/AppConfig.json"

import SideMenu from "#components/common/SideMenu";
import HeaderMenu from "#components/common/HeaderMenu"
import AttendanceSideMenu from "#components/attendance/AttendanceSideMenu";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 메인화면` },
		{ name: "description", content: "메인으로 들어오셨습니다." },
	];
};


// @Remix:url(/main) - 메인화면을 구성하는 페이지
export default function Main() {
	const location = useLocation();
	const pathname = location.pathname;

	// 경로가 /main/attendance 또는 그 하위 경로면 AttSideMenu 사용
	const isAttPage = pathname.startsWith("/main/att");

	return (
		<Container>
			{isAttPage ? <AttendanceSideMenu /> : <SideMenu />}

			<Container>
				<HeaderMenu />
				<Outlet />
			</Container>

		</Container>
	);
}
