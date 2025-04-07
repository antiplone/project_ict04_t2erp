import { Container } from "rsuite";

export function meta() {
	return [
		{ title: "다른페이지" },
		{ name: "description", content: "다른페이지로 왔어요!" },
	];
};

export const links = () => [
	// { rel: "stylesheet", href: styles },
];

// @Remix:url(/main/other) - 예시로 만든 다른페이지
export default function Other() {
	return (
		<Container>
			다른 페이지로 왔네요..
		</Container>
	);
}
