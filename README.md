# MyLink

개인 크리에이터와 일반 사용자를 위한 멀티 링크·바이오 프로필 서비스입니다.

## 실행

```bash
cd mylink
npm ci
WATCHPACK_POLLING=true npm run dev -- --webpack
```

http://localhost:3000 에서 확인할 수 있습니다.

## 현재 구현

- 프로필 일러스트, 이름, 소개와 외부 링크
- 토스 디자인 카탈로그를 참고한 색상·글꼴·간격
- 모바일·태블릿·데스크톱 반응형 화면

## 서비스 확장 범위

- 공개 프로필: 아바타, 이름, 자기소개, 소셜 배지, URL 링크, 섹션 헤더
- 편집기: 모바일 목업 실시간 미리보기, 드래그 링크 정렬, 프로필·링크 관리
- 테마: 블루 TDS, 다크, 페스티벌 프리셋
- 통계: 총 방문자 수, 링크별 누적 클릭, 최근 추이 차트
- 데이터: LocalStorage 영구 보관과 Mock 데이터 기반 클라이언트 데모

확장 기능은 아직 구현되지 않았습니다. 별도 서버와 Firebase 인증은 현재 범위에 포함하지 않습니다.

## 구조

- `mylink/src/app`: Next.js App Router 페이지
- `mylink/src/components`: 프로필 UI
- `mylink/public`: 이미지와 서체
- `mylink/docs/DESIGN.md`: 참고 디자인 규칙

기존 `mylink/index.html`은 GitHub Pages용 정적 페이지입니다. Next.js 앱과 별도로 동작합니다.
