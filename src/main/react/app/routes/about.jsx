import { Outlet } from "@remix-run/react";

export function meta() {
	return [
		{ title: "우리는..." },
		{ name: "description", content: "Ordit의 설명페이지 입니다." },
	];
};

export const links = () => [
	// { rel: "stylesheet", href: styles },
];

export default function About() {
	return (
		<div>
			우리가 뭘하고 있냐면요...
		</div>
	);
}
