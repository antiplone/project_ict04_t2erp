/* eslint-disable react/react-in-jsx-scope */
import { Outlet, useLocation } from "@remix-run/react";
import { Container, Content } from "rsuite";

import AppConfig from "#config/AppConfig.json"

import SideMenu from "#components/common/SideMenu";
import HeaderMenu from "#components/common/HeaderMenu"
import SideMenu_hr from "#components/hr/SideMenu_hr";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 메인화면` },
		{ name: "description", content: "메인으로 들어오셨습니다." },
	];
};

// @Remix:모듈함수 - 페이지가 처음 불려졌을때, 여기로 들어와서, 데이터를 가지고옵니다.
clientLoader.hydrate = true;
export async function clientLoader({ request/* or params */ }) {

	const urls = request.url.split('/'); // url전체 경로를 '/'기준으로 나눠서 배열로 저장
	//	const navigate = useNavigate();
	const pageName = urls[urls.length - 1]; // 현재 페이지명
	console.log("현재 페이지는", pageName);

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

// @Remix:url(/main) - 메인화면을 구성하는 페이지
export default function Main() {

	const location = useLocation();      // 현재 브라우저 주소창(URL)의 위치 정보를 locatcion 객체에 담는다.
   const pathname = location.pathname;   // 현재 URL 경로를 문자열로 가져와(=location.pathname) pathname 객체에 가져온 값을 저장한다.

	// 경로가 /main/att 또는 그 하위 경로면 AttSideMenu 사용
	const isAttPage = pathname.startsWith("/main/hr");

	return (
		<Container>
			{isAttPage ? <SideMenu_hr /> : <SideMenu />}

			<Container>
				<HeaderMenu />
				<Outlet />
			</Container>

		</Container>
	);
}
