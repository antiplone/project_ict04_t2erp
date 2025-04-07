/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useSubmit } from "@remix-run/react";
import {
	Form,
	Button,
	Stack,
	Panel,
	VStack,
	Divider,
	InputGroup,
	Input,
} from "rsuite";

import AppConfig from "#config/AppConfig.json"

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 로그인` },
		{ name: "description", content: "로그인 인증을 시도합니다." },
	];
};

// @Remix:모듈함수 - Submit관련 with Form's action
export async function clientAction({ request }) { // non-GET
	const formData = await request.formData();
	console.log(formData.get('name'));
	return formData;
};

// @Remix:모듈함수 - 페이지가 처음 불려졌을때, 여기로 들어와서, 데이터를 가지고옵니다.
export async function clientLoader({ request/* or params */ }) {

	const urls = request.url.split('/'); // url전체 경로를 '/'기준으로 나눠서 배열로 저장
	const pageName = urls[urls.length - 1]; // 현재 페이지명
	console.log("현재 페이지는", pageName);

	fetch(`http://localhost:8081/api/${pageName}`, { method: "GET" }) // fetcher
		.then((res) => res.text())
		.then((res) => {
			console.log(res);
		});

	return null;
};

// @Remix:url(/login) - 사원로그인 페이지
export default function Login() {

	const location = useLocation();
	const nav = useNavigate();
	const submit = useSubmit();

	console.log(location.pathname);
	// fetch()를 통해 톰캣서버에게 데이터를 요청
	useEffect(
		() => {
			fetch("http://localhost:8081/api/publishTest", { method: "GET" })
				.then((res) => res.text())
				.then((res) => {
					console.log(res);
					// setBoardList(res);
				});
		},
		[
			/* Renderer 초기화 시점 */
		]
	);

	const Password = forwardRef((props, ref) => {
		const [visible, setVisible] = useState(false);
		const handleChange = () => {
			setVisible(!visible);
		};

		return (
			<InputGroup inside ref={ref} {...props}>
				<Input type={visible ? "text" : "password"} />
			</InputGroup>
		);
	});

	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			style={{ height: "100%" }}
		>
			<Panel header="사원정보를 입력해주세요" bordered style={{ width: 400 }}>
				<Form fluid onSubmit={(formValue) => submit(formValue, {method: "POST"})}>
					<Form.Group>
						<Form.ControlLabel>사번</Form.ControlLabel>
						<Form.Control name="name" />
					</Form.Group>
					<Form.Group>
						<Form.ControlLabel>비밀번호</Form.ControlLabel>
						<Form.Control
							name="password"
							autoComplete="off"
							accepter={Password}
						/>
					</Form.Group>

					<VStack spacing={10}>
						<Button type='submit' appearance="primary" block>
							로그인
						</Button>
						<a href="#">비밀번호를 잊으셨나요?</a>
					</VStack>
				</Form>

				<Divider>OR</Divider>

				<Button block href="https://github.com/rsuite/rsuite">
					Continue with Github
				</Button>
			</Panel>
		</Stack>
	);
}
