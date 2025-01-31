# Code Review Hub

AI 기반 코드 리뷰 시스템 관리 대시보드

## 데모 페이지

🔗 [데모 페이지 바로가기](https://krnomad.github.io/code-review-hub)

### 데모 접속 정보
- 관리자 모드 비밀번호: `demodemo`

## 주요 기능

- 사용자 기능
  - 코드 리뷰 시스템 사용 요청서 작성
  - AI 코드 리뷰 프롬프트 테스트
  - 프로젝트 현황 관리
  - 사용 가이드

- 관리자 기능
  - 요청서 관리
  - 프로젝트 관리
  - 사용 통계
  - 토큰 관리

## 기술 스택

- React
- TypeScript
- Tailwind CSS

## 프로젝트 소개
이 프로젝트는 BitBucket 저장소의 코드 리뷰를 효율적으로 관리하기 위한 웹 애플리케이션입니다. AI를 활용한 자동 코드 리뷰 기능과 함께 토큰 관리, 프로젝트 요청서 관리 등의 기능을 제공합니다.

### 주요 기능
- 🔑 BitBucket API 토큰 관리
- 📝 프로젝트 요청서 작성 및 관리
- 🤖 AI 기반 코드 리뷰 테스트
- 📊 사용 통계 확인
- 👥 관리자/사용자 모드 지원

## 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 방법

```bash
# 저장소 클론
git clone https://bitbucket.org/your-team/bitbucket-review-manager.git

# 프로젝트 폴더로 이동
cd bitbucket-review-manager

# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

### 빌드 방법

```bash
# 프로덕션용 빌드
npm run build
# 또는
yarn build

# 빌드된 결과물 실행
npm run start
# 또는
yarn start
```

### 환경 변수 설정
1. 프로젝트 루트에 `.env` 파일 생성
2. 아래 환경 변수 설정

```env
VITE_APP_API_URL=your_api_url
VITE_APP_ADMIN_PASSWORD=your_admin_password
```

### 테스트 실행

```bash
# 단위 테스트 실행
npm run test
# 또는
yarn test

# E2E 테스트 실행
npm run test:e2e
# 또는
yarn test:e2e
```

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── reducers/           # 상태 관리 리듀서
└── main.tsx            # 메인 애플리케이션
```

## 주요 기능 설명

### 사용자 모드
- **요청서 작성**: 새로운 프로젝트 등록 및 관리
- **Prompt 테스트**: AI 코드 리뷰 기능 테스트
- **내 프로젝트**: 등록된 프로젝트 조회 및 관리

### 관리자 모드
- **요청서 관리**: 사용자 요청 승인/거절
- **프로젝트 관리**: 전체 프로젝트 관리
- **토큰 관리**: BitBucket API 토큰 관리
- **통계**: 시스템 사용 현황 확인

## 문제 해결
- 설치 중 오류 발생 시 `node_modules` 삭제 후 재설치
- 포트 충돌 시 `.env` 파일에서 `PORT` 변경
- 기타 문제는 이슈 트래커에 등록해주세요

## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.

## 기여하기
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
