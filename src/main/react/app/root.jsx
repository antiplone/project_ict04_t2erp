/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import "rsuite/dist/rsuite.min.css";

import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { Placeholder, Loader, Container } from "rsuite";

import AppConfig from "#config/AppConfig.json"

// @Remix:화면구성 - 화면의 전체적인구성 App()의 <Outlet />에 들어간다.
export function Layout({ children }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />{/* 자식들의 <meta>가 여기에 들어간다. */}
				<Links />{/* 자식들의 <link>가 여기에 들어간다. */}
			</head>
			<body>
				<div style={{ display: "flex", flexDirection: "column" }}>
					{AppConfig.isDev ? <span style={{ textAlign: "center", fontWeight: "bold", color: "royalblue" }}>
						개발버전입니다.
					</span> : null}
					{children}{/* 자식페이지들이 보여질부분 */}
				</div>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

// @Remix:index.html - 처음으로 화면에 보여지는 부분
export default function App() {
	return <Outlet />;
}

// @Remix:모듈함수 - 페이지들이 로딩이될때 보여줍니다.
export function HydrateFallback() { // SPA모드에서는 root에만 있어야 한다.
	return (
		<Container>
			<Placeholder.Paragraph rows={16} />
			<Loader center content="불러오는중..." />
		</Container>
	);
}
