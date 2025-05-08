# Remix SPA 모드 템플릿

이 템플릿은 [Remix SPA 모드](https://remix.run/docs/en/main/guides/spa-mode)를 활용하여 [Client Data](https://remix.run/docs/en/main/guides/client-data)를 사용해 데이터를 불러오는것과 변형(Mutations)을 처리하는 `단일 페이지 응용프로그램램(SPA)`을 구축합니다.

## 설정

Remix를 SPA 방식으로 프로젝트를 [typescript](https://www.perplexity.ai/search/javascriptwa-typescriptyi-munb-mYPmLTUQS5.ACodGlFLJFg)방식으로 만들어줍니다. 그래서, 현재 구성해놓은건 `javascript`방식으로 바꾸어 놓은 프로젝트입니다.

```shellscript
npx create-remix@latest --template remix-run/remix/templates/spa
or	.jsx확장으로 되어있으면,
npm audit fix

npm i rsuite --save
```

## 개발

개발중인 환경을 실시간으로 확인할수 있고, 변경사항이 바로 적용이됩니다. `'Ctrl' + 'C'`로 취소할수 있습니다.

```shellscript
npm run dev
'o' + 'enter'
```

## 저작물 빌드

개발된 환경에서 사용할 응용프로그램을 `저작물(배포본)`로 만들려면 다음 명령어를 실행하세요. 이 명령어는 `assets(resource:자원)`과 SPA용 `index.html` 파일을 생성합니다.

```shellscript
npm run build
```

### 미리보기

빌드된 결과물을 미리 보려면 [vite preview](https://vitejs.dev/guide/cli#vite-preview)를 사용하여 제대로 만들어졌는지 확인할 수 있습니다. `'Ctrl' + 'C'`로 취소할수 있습니다.

```shellscript
npm run preview
'o' + 'enter'
```

> [!중요]
>
> `vite preview`는 npm start처럼 서버 구성으로 사용하기에는 적합하지 않습니다.
> 현재 개발구성이 SPA형식이므로, 아래의 `배포`방식을 사용해야합니다.
> 아래에 `배포`사항 또한 권장일 뿐이지, 여러방식이 있습니다.


### 배포

애플리케이션은 원하는 HTTP 서버에서 제공할 수 있습니다. 서버는 단일 루트 /index.html 파일(일반적으로 "SPA fallback"이라고 함)을 통해 여러 경로를 제공하도록 설정되어야 합니다. 서버가 이 기능을 직접 지원하지 않는 경우 추가 설정이 필요할 수 있습니다.

간단한 예로, [sirv-cli](https://www.npmjs.com/package/sirv-cli)를 사용할 수 있습니다:

```shellscript
npx sirv-cli build/client/ --single
```

## npm 설치해야 할꺼
### 리액트 아이콘
npm install react-icons

### 주소api
npm i react-daum-postcode

### 이메일 API
npm install axios
#### -pom.xml
    <!-- Spring Boot Mail Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>

### 1:1 채팅
npm install sockjs-client stompjs
npm install @stomp/stompjs sockjs-client
#### -pom.xml
    <!-- websocket -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>

### Aapache POI API - 엑셀 변환 API
#### -pom.xml
    <!-- Apache POI 엑셀 변환용 : 핵심기능 -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi</artifactId>
        <version>5.2.3</version>
    </dependency>
    <!-- Apache POI 엑셀 변환용 : .xlsx 파일용 -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi-ooxml</artifactId>
        <version>5.2.3</version>
    </dependency>

### Java Mail API
npm install print-js

### FullCalendar API
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction
#### -현재 몇 버전으로 깔렸는지 확인할 수 있는 명령어
#### -예시: @fullcalendar/react@6.x.xx 라고 나오면 됨
npm ls @fullcalendar/react

### 공휴일 API(구글 캘린더) + API 키 발급(구글 클라우드 콘솔)
[Google Cloud Console](https://console.cloud.google.com/welcome?project=erp-system-458206)
1. url 접속
2. 새 프로젝트 생성 (ex. "ERP system")
3. API 및 서비스 > 라이브러리 > "Google Calendar API" 검색 > 클릭 후 사용버튼 누르기
4. 사용자 인증 정보 > API 키 만들기
5. 발급된 API 키 복사

### 날씨 API
[OpenWeatherMap API](https://openweathermap.org/api)
1. 회원가입
2. 오른쪽 상단에 이름 클릭 > My API Keys(내 API 키) > Name이 Default 라고 써져있는 Key를 사용하면 OK
[시군구](https://developers.kakao.com/)
[위도 경도 찾는 사이트](http://map.esran.com/)

### 크롤링
#### 1. VS Code 에서 Python 설치 → python 이라고 검색했을 때, 제일 처음에 나오는거 설치하면 됩니다.
#### 2. Ctrl + Shift + P → Python: Select Interpreter 라고 검색한 후 설치된 Python 버전 선택 (예: Python 3.9.21 → anaconda 에서 설치한 버전이랑 맞췄습니다.)
#### 3. 터미널에서 pip install requests beautifulsoup4 설치

#### 4. 확인
#### - pip show requests
Name: requests
Version: 2.32.3
#### - pip show beautifulsoup4
Name: beautifulsoup4
Version: 4.12.3

### coolsms API
#### pom.xml
    <!-- coolSMS 의존성 주입 -->
    <dependency>
        <groupId>net.nurigo</groupId>
        <artifactId>sdk</artifactId>
        <version>4.3.2</version>
    </dependency>
    
    
### python 가상환경 설정 ###
## 01.python 가상 환경 만들기
python -m venv 폴더명 
## 02.python 가상 환경 활성화
.\폴더명\Scripts\activate 
## 03.python 가상 환경 확인
(폴더명) D:\DEV\workspace_ict04_final_personal\20250415\project_ict04_t2erp\python-backend>
## 04.pip 최신화
pip3 install --upgrade pip
## 05.패키지 또는 라이브러리 설치
pip install 패키지명.확장자 또는 라이브러리==버전
## 06.비활성화
deactivate 
