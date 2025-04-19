import { Container } from "rsuite";

import AppConfig from "#config/AppConfig.json"

// @Remix:모듈함수 - <html>의 <head>의 내용
/*export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 회계` },
		{ name: "description", content: "다른페이지로 왔어요!" },
	];
};*/

export const links = () => [
	// { rel: "stylesheet", href: styles },
];

// @Remix:모듈함수 - 페이지가 처음 불려졌을때, 여기로 들어와서, 데이터를 가지고옵니다.
export async function clientLoader({ params }) {

	console.log(params.category);

	return null;
};

// @Remix:url(/main/other) - 예시로 만든 다른페이지
export default function _Category() {
	return (
		<Container>
			다른 페이지로 왔네요..
		</Container>
	);
}
