## 1️⃣ Props Drilling
✔ Props Drilling이란?

상위 컴포넌트의 데이터를 중간 컴포넌트들이 직접 사용하지 않는데도 단지 아래로 전달하기 위해 props를 계속 내려보내는 구조.

React의 단방향 데이터 흐름 때문에 발생.

✔ 문제가 되는 이유

중간 컴포넌트가 불필요한 props로 오염됨.

유지보수 어려움 (props 이름/타입 변경이 전파).

컴포넌트 구조 변경 시 수정 범위 커짐.

가독성 저하.

✔ 자주 발생하는 상황

user, theme 같은 전역 성격의 상태가 여러 곳에서 필요할 때.

모달/알림 등 UI 상태가 여러 컴포넌트와 연결될 때.

✔ 해결 방법

컴포넌트 구조 리팩토링.

Context API 사용.

Redux Toolkit / Zustand / Jotai 등 전역 상태관리 도구 사용.

공통 로직을 Custom Hook으로 분리.

## 2️⃣ useReducer
✔ useReducer란?

복잡한 업데이트 로직을 reducer 함수로 관리하는 상태 관리 도구.

useState보다 다양한 액션 / 복잡한 상태에서 유리.

✔ 구성 요소

state : 현재 상태

dispatch : 액션 발생 함수

reducer(state, action) : 상태 업데이트 로직

initialState : 초기 상태 값

✔ 언제 사용하면 좋은가?

상태가 여러 형태로 업데이트될 때(증가, 감소, 리셋 등)

객체/복합 구조 상태를 다룰 때

dispatch만 전달하며 props drilling 줄이고 싶을 때

테스트 가능한 상태 업데이트 로직이 필요할 때

✔ useState와 비교
항목	useState	useReducer
상태가 단순함	👍	😐
로직 복잡	😐	👍
액션 종류 많음	😐	👍
컴포넌트에서 로직 분리	어려움	쉬움
✔ useReducer + Context

전역 상태처럼 사용 가능.

Redux 없이도 “작은 전역 상태 관리 시스템” 구현 가능.

## 3️⃣ Redux & Redux Toolkit (RTK)
✔ Redux란?

예측 가능한 전역 상태 관리 패턴.

Store + Reducer + Action 구조.

단점: 보일러플레이트 많고 코드 복잡.

✔ Redux Toolkit(RTK)이란?

Redux의 공식 권장 방식.

보일러플레이트 제거 + 불변성 자동 + 간결한 패턴.

createSlice, configureStore, createAsyncThunk 제공.

✔ Redux vs Redux Toolkit 비교
항목	Redux	RTK
코드량	많음	적음
불변성 관리	직접	자동 (Immer)
Reducer	switch	createSlice
비동기	설정 필요	createAsyncThunk
난이도	높음	쉬움
공식 권장 여부	X	✔
✔ RTK 핵심 API

configureStore : store 생성

createSlice : reducer + action creator 한번에 생성

useSelector / useDispatch : 상태 조회 & 액션 실행

createAsyncThunk : 비동기 로직 처리

## 4️⃣ Zustand
✔ Zustand란?

React에서 사용하는 가벼운 전역 상태관리 라이브러리.

Provider 필요 없음.

Redux보다 훨씬 단순함.

selector로 필요한 상태만 구독 → 렌더 최적화 우수.

✔ 장점

최소 보일러플레이트

선택적 구독(selector)로 렌더링 최소화

비동기 로직 store 내부에서 바로 가능

persist / immer 등 미들웨어 연동 쉬움

TS 친화적

✔ 핵심 개념

create() : 스토어 생성

set() : 상태 업데이트

get() : 현재 상태 가져오기

selector : 필요한 부분만 구독하여 리렌더 최소화

✔ 주요 미들웨어

persist : LocalStorage 저장

immer : 불변성 자동 관리

✔ Zustand vs Context API
항목	Zustand	Context API
렌더링 최적화	매우 우수	전체 리렌더 발생
설정 난이도	쉬움	쉬움
전역 상태 적합성	높음	낮음
비동기 로직	store 안에서 가능	별도 useEffect 필요
## 5️⃣ React 전역 상태 관리 (블로그 요약)
Context API vs Zustand

Context API: Provider value가 바뀌면 전체 구독 → 모두 리렌더

Zustand: selector로 필요한 조각만 구독 → 부분 리렌더

Zustand가 성능적으로 우수한 이유 = 선택적 구독

Zustand vs Jotai (파생 상태 기준)

Zustand는 selector는 있지만 의존성 자동 추적 없음

Jotai는 atom 조합 시 의존성 자동 추적 → 필요한 atom만 재계산

useEffect 서버 상태 관리 문제

캐싱 없음 → 새로고침/이동마다 API 호출

중복 요청 발생

화면/서버 상태 불일치 발생

경쟁 상태(Race Condition) 발생 가능

서버 상태는 React Query/TanStack Query처럼 전문 도구로 관리해야 함.

## 6️⃣ Redux Toolkit 장바구니 실습 핵심 키워드

cartSlice 생성 (increase / decrease / removeItem / clearCart / calculateTotals)

Mock Data → 초기 상태 설정

Provider로 store 연결

useSelector / useDispatch로 상태 + 액션 연결

Tailwind로 UI 구성

## 7️⃣ Modal Slice 실습 핵심 키워드

modalSlice 별도 분리

openModal / closeModal reducer 구현

useState 사용  → 모든 제어 reducer 기반

모달에서 cartSlice의 clearCart 액션 호출 (전역 상태 간 상호작용)

## 8️⃣ Redux Toolkit → Zustand 리팩토링 핵심 키워드

Redux store 삭제 → Zustand store로 통합

increase / decrease / removeItem 동일 액션을 Zustand 액션으로 변환

modal 상태도 Zustand 스토어에서 관리

useSelector / useDispatch 대체 → useStore((s) => s.value) 방식

최종 UI 동작이 동일하도록 유지

## 9️⃣ 전체 흐름 요약 (초간단)

Props Drilling → Context/상태관리로 해결

useReducer → 복잡한 로직/객체 상태에 강함

Redux Toolkit → Redux의 공식 현대적 방식

Zustand → 가장 간단·가벼운 전역 상태 관리

Jotai → 의존성 자동 추적으로 파생 상태에 강함

useEffect로 서버 상태 관리하면 문제 많음 → React Query 필요