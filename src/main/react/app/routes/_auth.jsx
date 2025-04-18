/* eslint-disable react/react-in-jsx-scope */
import { Outlet } from "@remix-run/react";

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

// @Remix:url(/login, /signin) - 사원 ERP접근 페이지
export default function _Auth() {
	return <Outlet />;
}
