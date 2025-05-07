/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Container } from "rsuite";

import AppConfig from "#config/AppConfig.json"

import HeaderMenu from "#components/common/HeaderMenu"
import Chatbot from '#components/chatbot/chatbot';
import Management from "./main.att-management";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 메인화면` },
		{ name: "description", content: "메인으로 들어오셨습니다." },
	];
};

// 파비콘. 이미지는 public 폴더에 있습니다.
export function links() {
	return [
	  	{ rel: "icon", type: "image/png", href: "/brand.png?v=2" } // 캐시 방지용 v=2 추가!
	];
}

// @Remix:모듈함수 - 페이지가 처음 불려졌을때, 여기로 들어와서, 데이터를 가지고옵니다.
clientLoader.hydrate = true;
export async function clientLoader({ request/* or params */ }) {

	const urls = request.url.split('/'); // url전체 경로를 '/'기준으로 나눠서 배열로 저장
	//	const navigate = useNavigate();
	const pageName = urls[urls.length - 1]; // 현재 페이지명
//	console.log("현재 페이지는", pageName);

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

	const location = useLocation();      // 현재 브라우저 주소창(URL)의 위치 정보를 locatcion 객체에 담는다.
	const nav = useNavigate();
	const pathname = location.pathname;   // 현재 URL 경로를 문자열로 가져와(=location.pathname) pathname 객체에 가져온 값을 저장한다.

	const empInfo = useState("");
	const [ myInfo ] = empInfo;

	useEffect(() => {

		if (localStorage.length < 1) // 세션이 없으면, 로그인으로
			nav("/", { replace: true });
		else {

//			console.log(localStorage.getItem("e_auth_id")); // 세션정보출력

			if (localStorage.getItem("e_auth_id") == null) { // 임시적 처리, 비동기를 더 생각해봐야
				localStorage.clear();
				nav("/", { replace: true });
			}
		}
	}, [ myInfo ]);

	const isMain = pathname === "/main";

	return (
		<Container style={{ display: "block", width: "1920px", margin: "0 auto" }}>

			<Container>
				<HeaderMenu empInfo={empInfo} />
				{isMain ? <Management /> : <Outlet />}	{/* URL이 메인이면 근태, 아니라면 그 외 */}
				<Chatbot width={150} height={150} style={{ padding: '6px' }} />
			</Container>

		</Container>
	);
}
