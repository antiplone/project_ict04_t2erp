// 웹 페이지의 정보(메타데이터)를 설정해주는 함수. 즉, 웹페이지의 명함이라 할 수 있음.
export default function Meta({ title, name="description", content }) {
  return [
    { title: {title} },  // title: html에서 쓰는 <title>내용</title> 과 같음
    { name: {name}, content: {content} },
    // name, content: html에서 쓰는 <meta name="" content=""> 와 같음
  ];
}
