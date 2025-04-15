/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Container, Content } from "rsuite";

import AppConfig from "#config/AppConfig.json"

import SideMenu from "#components/common/SideMenu";
import HeaderMenu from "#components/common/HeaderMenu"
import SideMenu_attendance from "#components/attendance/SideMenu_attendance";
import SideMenu_hr from "#components/hr/SideMenu_hr";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 메인화면` },
		{ name: "description", content: "메인으로 들어오셨습니다." },
	];
};

// @Remix:모듈함수 - 페이지가 처음 불려졌을때, 여기로 들어와서, 데이터를 가지고옵니다.
export async function clientLoader({ request/* or params */ }) {

	const urls = request.url.split('/'); // url전체 경로를 '/'기준으로 나눠서 배열로 저장
	//	const navigate = useNavigate();
	const pageName = urls[urls.length - 1]; // 현재 페이지명
	console.log("현재 페이지는", pageName);

//	console.log(localStorage.getItem("e_auth_id"));

	/*	const fetchURL = AppConfig.fetch['mytest'];
		console.log(`${fetchURL.protocol}${fetchURL.url}/api/`);
		fetch(`${fetchURL.protocol}${fetchURL.url}/auth/get`, { method: "GET" }) // fetcher
			.then((res) => res.text())
			.then((res) => {
				console.log(res);
			});
	*/
	return null;
};
clientLoader.hydrate = true;

// @Remix:url(/main) - 메인화면을 구성하는 페이지
export default function Main() {
	const location = useLocation();		// 현재 브라우저 주소창(URL)의 위치 정보를 locatcion 객체에 담는다.
	const nav = useNavigate();
	const pathname = location.pathname;	// 현재 URL 경로를 문자열로 가져와(=location.pathname) pathname 객체에 가져온 값을 저장한다.

	useEffect(() => {
		if (localStorage.length < 1) // 세션이 없으면, 로그인으로
			nav("/", { replace: true });
		else console.log(localStorage.getItem("e_auth_id")); // 세션정보출력
	}, []);

	// startsWith : 주어진 문자열이 특정 문자로 시작하는지 확인하는 함수
	// 즉, 경로가 /main/att 또는 그 하위 경로를 isAttPage 객체를 저장한다.
	const isAttPage = pathname.startsWith("/main/att");
	const isHrPage = pathname.startsWith("/main/hr");

	let sideMenus;
	if (isAttPage)
		sideMenus = <SideMenu_attendance />;
	else if (isHrPage)
		sideMenus = <SideMenu_hr />;
	else
		sideMenus = <SideMenu />;

	return (
		<Container>
			{sideMenus}

			<Container>
				<HeaderMenu />
				<Outlet />
			</Container>

		</Container>
	);
}
