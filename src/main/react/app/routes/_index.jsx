/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react";
import { useLocation, useNavigate } from "@remix-run/react";

import AppConfig from "#config/AppConfig.json"

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: AppConfig.meta.title },
		{
			name: "description",
			content: "Ordit을 이용해주셔서 감사합니다."
		},
	];
};

// @Remix:url(/) - 세션을 확인후 페이지 이동
export default function Index() {

	const location = useLocation();
	const nav = useNavigate();

	useEffect(() => { // 세션이 없으면, 로그인 페이지로
		if (location.pathname === "/") {
			nav("/login", { replace: true });
		}
	}, []);
}
