/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useState, useEffect } from "react";
import { useLocation, useNavigate, redirect, useSubmit } from "@remix-run/react";
import {
	Form, Schema,
	Button,
	Stack,
	Panel,
	VStack,
//	Divider,
	InputGroup,
	Input,
	Loader
} from "rsuite";

import AppConfig from "#config/AppConfig.json"

const { StringType } = Schema.Types;
const model = Schema.Model({
	eID: StringType().isRequired("'사번'을 입력해주세요."),
	password: StringType().isRequired("'비밀번호'를 입력해주세요.")
});

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 로그인` },
		{ name: "description", content: "로그인 인증을 시도합니다." },
	];
};

let handleAuthData, handleLoading;
// @Remix:모듈함수 - Submit관련 with Form's action
export async function clientAction({ request }) { // non-GET
	const formData = await request.formData();
	let entity = {};
	for (let pair of formData.entries()) {
		entity[pair[0]] = pair[1];
	}
	//console.log(entity);
	handleLoading(true);

	const fetchURL = AppConfig.fetch['mytest'];
	fetch(`${fetchURL.protocol}${fetchURL.url}/auth/get`, {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(entity)
	})
		.then((res) => {
			handleLoading(false);
			if (res.ok) {
				handleLoading(true);
				entity = res.json();
				console.log("Promise 시작:", entity);
				entity.then(
					res => {
						handleAuthData(res);
						console.log("Promise 완료:", res);
					}
				);
			}
		})
		.finally(() => {
			handleLoading(false);
		});

	return redirect("");
};

// @Remix:url(/login) - 사원로그인 페이지
export default function Login() {

	const location = useLocation();
	const nav = useNavigate();
	const submit = useSubmit();
	const [authData, setAuthData] = useState();
	handleAuthData = setAuthData;
	const [isLoading, checkLoading] = useState(false);
	handleLoading = checkLoading;

	console.log(location.pathname);

	useEffect(() => {
		if (authData != null)
			nav("/main");
	}, [authData, isLoading]);

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
				<Form fluid
					onSubmit={(formValue) => submit(formValue, { method: "POST" })}
					model={model}
				>
					<Form.Group>
						<Form.ControlLabel>사번</Form.ControlLabel>
						<Form.Control name="eID" />
					</Form.Group>
					<Form.Group>
						<Form.ControlLabel>비밀번호</Form.ControlLabel>
						<Form.Control
							name="password"
							autoComplete="off"
							type="password"
						//accepter={Password}
						/>
					</Form.Group>

					<VStack spacing={10}>
						<Button style={{color: "#333333", fontWeight: "bold"}} type='submit' appearance="primary" loading={isLoading} block>
							로그인
						</Button>
						<a href="#">비밀번호를 잊으셨나요?</a>
					</VStack>
				</Form>

				{/*				<Divider>OR</Divider>

				<Button block href="https://github.com/rsuite/rsuite">
					Continue with Github
				</Button>
*/}			</Panel>
		</Stack>
	);
}
