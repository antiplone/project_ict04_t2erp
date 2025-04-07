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
