1️⃣ OAuth 2.0

정의:
사용자의 로그인 정보(비밀번호)를 제3자 앱에 직접 제공하지 않고도,
데이터 접근 권한을 안전하게 위임하기 위한 권한 부여 프레임워크
→ "구글 로그인" 기능이 대표적 예시.

주요 역할자

역할	설명
리소스 소유자	사용자
클라이언트	사용자 대신 데이터를 요청하는 앱
권한 서버	토큰 발급 담당 (예: Google Auth Server)
리소스 서버	실제 보호된 데이터를 제공하는 서버

흐름 요약 (Authorization Code with PKCE)

React 앱이 code_verifier, code_challenge 생성

사용자 → 권한 서버로 리다이렉트

동의 후 Authorization Code 발급

백엔드가 Code + Verifier로 Access Token 교환

백엔드 → 리소스 서버에 접근 후 데이터 전달

OAuth 2.0 vs OIDC

OAuth 2.0: 권한 부여 중심

OIDC(OpenID Connect): OAuth 2.0 위에 인증 계층 추가 (사용자 정보 확인 가능)

장점 / 단점

👍 자격증명 노출 없이 보안 강화, 표준화, 확장성 높음

👎 구조 복잡, 설정 오류 시 보안 위험 (리다이렉트 변조 등)

2️⃣ CORS (교차 출처 리소스 공유)

정의:
브라우저가 다른 출처(Origin) 의 리소스 접근을 허용하기 위한 메커니즘
(SOP의 제한을 완화하기 위해 등장)

SOP 원칙:
같은 프로토콜 + 도메인 + 포트 조합만 허용.

작동 방식

Simple Request:
GET/POST/HEAD 메서드 + 안전한 헤더 사용 시 사전 요청 없이 바로 전송

Preflight Request:
PUT, DELETE, 혹은 커스텀 헤더(X-...)가 포함된 경우
→ 브라우저가 먼저 OPTIONS 요청으로 허용 여부 확인 후 실제 요청 전송

핵심 응답 헤더

헤더	설명
Access-Control-Allow-Origin	허용할 출처 지정 (http://localhost:8080)
Access-Control-Allow-Methods	허용할 HTTP 메서드
Access-Control-Allow-Headers	허용할 요청 헤더 (예: Authorization)
Access-Control-Allow-Credentials	쿠키/인증정보 포함 허용 여부 (true)

예시

res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


문제 발생 시 체크

Origin 일치 여부 확인

서버 응답 헤더 설정 여부

credentials 옵션 설정 여부 (fetch(..., { credentials: 'include' }))

3️⃣ CSP (Content Security Policy)

정의:
브라우저가 HTML 해석 시 허용된 출처의 리소스만 로드하도록 제어하는 보안 정책.

핵심 헤더

res.setHeader("Content-Security-Policy", "default-src 'self'");


정책 의미

'self': 동일 출처 리소스만 허용

외부 스크립트, 인라인 코드, 인라인 스타일 기본 차단

Report-Only 모드

실제 차단은 하지 않고, 위반 로그만 보고

브라우저 콘솔 및 report-uri로 전송

보안 강화 비유:
“건물 출입 통제 시스템” → 승인된 출처(직원)만 출입 가능

4️⃣ SOP (Same Origin Policy)

정의:
브라우저가 다른 출처 간의 데이터 접근을 제한하는 핵심 보안 정책.

출처 구성 요소:
프로토콜 + 도메인 + 포트

특징

요청은 전송 가능하지만, 응답 데이터는 차단

쿠키, localStorage, DOM 접근, fetch 응답 등에서 적용됨

보호 대상

항목	제한 이유
DOM 접근	다른 창/iframe 조작 차단
Storage 접근	세션/쿠키 유출 방지
Fetch 응답	민감 정보 유출 방지

SOP vs CSP 요약

구분	SOP	CSP
적용 주체	브라우저 자동	서버 설정
초점	데이터 접근 제한	리소스 실행 제한
설정 가능성	불가	가능
목적	기본 보안	추가 방어
5️⃣ RBAC vs ABAC

RBAC (Role-Based Access Control)

역할(Role)에 따라 권한 부여 (예: 관리자, 일반 사용자)

👍 단순, 관리 효율적

👎 세밀한 제어 어려움, 역할 폭발 문제 발생

ABAC (Attribute-Based Access Control)

속성(Attribute) 기반 동적 제어

사용자, 리소스, 행동, 환경 속성을 조합해 정책 적용

👍 세밀하고 유연한 제어 가능

👎 정책 정의 복잡

도입 기준

“역할만으로 제어하기 어려운 상황”
예: 본인 작성 문서만 수정 가능 / 사내망 접속 시만 허용 등

적용 전략

영역	방식	이유
기본 사용자 권한 관리	RBAC	전체 구조 단순화
데이터 접근 정책	ABAC	맥락 기반 세밀 제어

요청 대응 방식

요청 목적·범위 파악

정책 조건 검증

필요 시 임시 권한 or 승인 요청

감사 로그 기록
→ 조건 기반 신뢰를 부여하는 “정책 중심 접근 제어” 실천

6️⃣ Token Refresh 흐름

AccessToken: 짧은 유효기간 (예: 3초)

RefreshToken: 새 AccessToken 발급용 (장기 유효)

흐름:

로그인 시 AccessToken + RefreshToken 발급

AccessToken 만료 시 RefreshToken으로 새 토큰 요청

RefreshToken이 유효 → 새 AccessToken 발급

유효하지 않거나 블랙리스트 → 재로그인 요구

7️⃣ Google OAuth 로그인 (Web Flow)

사용자가 React 앱에서 “Google 로그인” 클릭

백엔드 /auth/google/login → Google 인증 페이지 리다이렉트

사용자가 로그인/동의

Google → 백엔드로 콜백 (/auth/google/callback)

백엔드가 AccessToken·RefreshToken 생성

React 앱으로 리다이렉트 (토큰 쿼리 전달)

React에서 토큰 저장 → 로그인 완료

✅ 한 줄 요약

OAuth는 ‘안전한 권한 위임’,
CORS는 ‘출처 간 요청 허용’,
CSP는 ‘리소스 출처 제한’,
SOP는 ‘출처 간 접근 차단’,
RBAC/ABAC은 ‘권한 부여의 정적/동적 모델’이다.