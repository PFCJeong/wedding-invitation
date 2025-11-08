# Wedding Invitation

결혼식 초대장 웹사이트

## 목차

- [시작하기](#시작하기)
- [로컬에서 실행하기](#로컬에서-실행하기)
- [빌드](#빌드)
- [포트 변경](#포트-변경)
- [기술 스택](#기술-스택)

## 시작하기

### 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js** (v14 이상 권장)
- **npm** 또는 **yarn** 패키지 매니저

### 설치 확인

```bash
# Node.js 버전 확인
node --version

# npm 버전 확인
npm --version

# yarn 버전 확인 (yarn 사용 시)
yarn --version
```

## 로컬에서 실행하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd wedding-invitation
```

### 2. 의존성 설치

npm 사용:
```bash
npm install
```

yarn 사용:
```bash
yarn install
```

### 3. 개발 서버 실행

npm 사용:
```bash
npm start
```

yarn 사용:
```bash
yarn start
```

브라우저가 자동으로 열리며 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

코드를 수정하면 페이지가 자동으로 새로고침됩니다.

## 빌드

프로덕션용 빌드를 생성하려면:

npm 사용:
```bash
npm run build
```

yarn 사용:
```bash
yarn build
```

빌드된 파일은 `build` 폴더에 생성되며, 배포 준비가 완료됩니다.

### 빌드 파일 로컬에서 실행

빌드된 파일을 로컬에서 테스트하려면:

```bash
# serve 패키지 설치 (전역)
npm install -g serve

# 빌드 폴더 서빙
serve -s build
```

## 포트 변경

기본 포트(3000) 대신 다른 포트로 실행하려면:

### 방법 1: 환경 변수 사용

npm 사용:
```bash
PORT=8080 npm start
```

yarn 사용:
```bash
PORT=8080 yarn start
```

### 방법 2: .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```
PORT=8080
```

그 후 일반적으로 실행:
```bash
yarn start
```

## 기술 스택

- **React** - UI 라이브러리
- **React App Rewired** - Webpack 설정 커스터마이징
- **SASS/SCSS** - 스타일링
- **React Copy to Clipboard** - 클립보드 복사 기능
- **React Toastify** - 알림 메시지

## Docker로 실행

Docker를 사용하여 실행하려면:

### 1. Docker 이미지 빌드

```bash
docker build -t wedding-invitation:latest .
```

### 2. 컨테이너 실행

```bash
docker run -d -p 80:80 --name wedding-app wedding-invitation:latest
```

브라우저에서 [http://localhost](http://localhost)로 접속할 수 있습니다.

다른 포트로 실행하려면:
```bash
docker run -d -p 8080:80 --name wedding-app wedding-invitation:latest
```

그러면 [http://localhost:8080](http://localhost:8080)으로 접속할 수 있습니다.

## 배포

AWS EC2 배포 가이드는 [CLAUDE.md](./CLAUDE.md) 파일을 참조하세요.

## 라이선스

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
