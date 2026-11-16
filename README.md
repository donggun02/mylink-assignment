# MyLink

개인 크리에이터와 일반 사용자를 위한 멀티 링크·바이오 프로필 서비스입니다.

## 실행

```bash
cd mylink
npm ci
WATCHPACK_POLLING=true npm run dev -- --webpack
```

http://localhost:3000 에서 확인할 수 있습니다.

## 기능

- 프로필 이름·소개·이미지 편집, 소셜 배지 관리
- URL 링크와 섹션 추가·수정·삭제, 공개 여부 설정
- 손잡이 드래그 정렬과 키보드·모바일용 위/아래 이동
- 모바일 목업 실시간 미리보기
- 블루 TDS·다크·페스티벌 테마
- 브라우저 내 방문자·링크별 클릭·최근 7일 추이
- LocalStorage 자동 저장 및 다른 탭 변경 반영
- 프로필 사본 공유 주소 복사

## 페이지

- `/`, `/mypage`: 편집기
- `/view`: 같은 브라우저에 저장된 공개 프로필
- `/view#profile=…`: 주소에 포함된 공유 시점의 프로필 사본

## 데이터와 공유

Firebase 설정이 있으면 프로필과 링크를 Firestore에 저장하고, 설정이 없으면 LocalStorage로 동작합니다. 편집기는 서버 저장 완료·진행·오류 상태를 구분하며, 오류 시 다시 연결할 수 있습니다.

- 프로필: `users/anonymous` 문서의 `profile` 필드
- 링크·섹션: `users/anonymous/links/{linkId}`
- 링크 순서: 각 문서의 `order`
- 생성·수정 시간: 서버 타임스탬프

클라우드 연결 시 기존 로컬 프로필은 별도 키에 보관합니다. 서버 링크가 비어 있으면 ‘기존 브라우저 링크 가져오기’로 가져올 수 있습니다. 이름·소개·테마 변경, 링크 추가·수정·삭제·정렬은 500ms 동안 묶어서 서버에 저장합니다. 저장 진행 중에는 페이지를 닫지 마세요.

현재는 인증 없는 공동 테스트 공간입니다. 모든 방문자가 같은 프로필과 링크를 읽고 변경합니다. `mylink/firestore.rules`는 해당 경로에만 접근을 허용하는 임시 규칙이며 2026-12-16에 만료됩니다. 실제 서비스 공개 전에는 인증과 사용자별 권한을 적용해야 합니다.

통계는 현재 브라우저에만 저장합니다. 방문자는 브라우저 식별자 기준이며, 방문 추이는 탭 세션당 하루 한 번 기록합니다. 미리보기는 집계하지 않고 다른 기기의 활동은 합산하지 않습니다.

클라우드 모드의 공유 주소 `/view`는 서버의 최신 프로필을 불러옵니다. 로컬 모드에서는 이름·소개·링크·테마 사본을 주소에 담으며, 업로드 이미지는 기본 아바타로 대체됩니다. localhost는 현재 컴퓨터에서만 접속할 수 있습니다.

## Firebase 설정

1. Firebase 콘솔에서 프로젝트와 웹 앱을 등록합니다.
2. Firestore Standard 데이터베이스를 `(default)` ID로 생성합니다.
3. `mylink/.env.example`을 `.env.local`로 복사해 웹 앱의 설정값을 입력합니다.
4. Firestore Rules에 `mylink/firestore.rules`의 내용을 게시합니다.
5. 개발 서버를 재시작합니다. 클라우드 연결 후 ‘Firestore에 저장됨’ 상태를 확인합니다.

`.env.local`은 Git에 포함하지 않습니다. 브라우저용 Firebase SDK만 사용하며 서비스 계정 키나 Admin SDK는 필요하지 않습니다.

이미지는 로컬 모드 최대800KB, 클라우드 모드 최대600KB의 PNG·JPG·WebP를 사용할 수 있습니다. 링크는 HTTP·HTTPS만 허용합니다.

## 구조

- `mylink/src/app`: Next.js App Router 페이지
- `mylink/src/components`: 프로필 UI
- `mylink/public`: 이미지와 서체
- `mylink/docs/DESIGN.md`: 참고 디자인 규칙

기존 `mylink/index.html`은 GitHub Pages용 정적 페이지입니다. Next.js 앱과 별도로 동작합니다.
