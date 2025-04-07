import AppConfig from "#config/AppConfig.json"

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
	return [
		{ title: `${AppConfig.meta.title} : 회원가입` },
		{ name: "description", content: "회원가입을 시도합니다." },
	];
};

// @Remix:url(/signin) - 회원가입 페이지
export default function Signin() {
    
}