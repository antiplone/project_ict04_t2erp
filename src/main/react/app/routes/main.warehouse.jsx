/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json"
import { Container } from "rsuite";
import { Outlet } from "@remix-run/react";
import OrderIncomeList from "#components/logis/order-income-list";
import OutgoingList from "#components/logis/outgoing-list";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: AppConfig.meta.title },
		{
			name: "description",
			content: "물류관리 메인입니다."
		},
	];
};

// @Remix:url(/login, /signin) - 사원 ERP접근 페이지
export default function LogisMain() {
	return (
		<Container>
			<div>
				<OrderIncomeList />
				<Outlet />
			</div>
				<OutgoingList />
		</Container> 
	);
}