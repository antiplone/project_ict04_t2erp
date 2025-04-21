import { Outlet, useLocation } from "@remix-run/react";
import { Container, Message, Tabs } from "rsuite";

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


// @Remix:url(/main/finance_main) - 회계 매출매입거래
export default function FinanceResume() {

	let location = useLocation();
	console.log(location.pathname);

	return (
		<Container>
			<Message type="info" className="main_title">
				회계-매출매입거래
			</Message>
			<Tabs defaultActiveKey="1">
				<Tabs.Tab eventKey="1" title="매입">{/* 구매 */}
					
				</Tabs.Tab>
				<Tabs.Tab eventKey="2" title="매출">{/* 판매 */}
					
				</Tabs.Tab>
			</Tabs>
			<Outlet />
		</Container>
	);
}
