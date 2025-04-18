import { Outlet, useLocation } from "@remix-run/react";
import { Container, Message } from "rsuite";

import RefTable from "#components/finance/RefTable"

import AppConfig from "#config/AppConfig.json"

import "#components/common/css/common.css";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 회계(FI)` },
		{ name: "description", content: "회계관련 페이지입니다." },
	];
};

// @Remix:모듈함수 - <html>의 <head>의 내용 : 외부 - CSS, Font등.. 링크
export const links = () => [
	// { rel: "stylesheet", href: styles },
];


// @Remix:url(/main/finance_main) - 회계 메인
export default function FinanceVoucher() {

	let location = useLocation();
	console.log(location.pathname);

	return (
		<Container>
			<Message type="info" className="main_title">
				회계-전표관리
			</Message>
			{/*<Outlet />*/}
			<RefTable />
		</Container>
	);
}
