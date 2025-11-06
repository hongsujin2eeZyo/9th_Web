TanStack Query 정리

TanStack Query는 서버 상태(Server State)를 효율적으로 관리하기 위한 라이브러리로,
비동기 데이터 패칭, 캐싱, 리패칭, 동기화, 에러 및 로딩 상태를 체계적으로 관리한다.
React 환경에서 서버 데이터를 효율적으로 다루기 위해 사용된다.

1. 핵심 개념

서버 상태(Server State): 클라이언트가 아닌 서버에 저장된 데이터로, 비동기 요청을 통해 관리한다.

캐싱(Caching): 동일한 요청 결과를 저장해 불필요한 네트워크 요청을 방지한다.

자동 리패칭(Refetching): 데이터가 오래되었거나(stale) 포커스가 복귀될 때 자동으로 새 데이터를 요청한다.

상태 관리 자동화: 로딩, 에러, 성공 상태를 자동으로 관리하며 UI 반응성을 높인다.

2. useQuery

useQuery는 서버 데이터를 가져오기 위한 핵심 훅이다.
queryKey를 통해 데이터를 구분하고, queryFn으로 비동기 함수를 실행한다.
데이터의 **신선도(freshness)**와 캐시 상태는 내부적으로 관리된다.

const { data, isPending, isError, error, isFetching, refetch } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 30_000,
  gcTime: 5 * 60 * 1000,
});

3. 주요 옵션
옵션	설명
queryKey	쿼리의 고유 식별 키. 동일 키 사용 시 캐시 공유
queryFn	데이터를 가져오는 비동기 함수
staleTime	데이터가 fresh → stale로 바뀌기까지의 시간(ms). 기본값 0
gcTime	비활성 데이터가 캐시에서 제거되기까지의 시간(ms). 기본값 5분
enabled	조건부 실행 여부 설정
retry / retryDelay	실패 시 재시도 횟수 및 간격
refetchOnWindowFocus	포커스 복귀 시 자동 갱신 여부
refetchInterval	주기적 자동 갱신 시간
select	데이터 가공 및 필터링
placeholderData	로딩 중 임시 데이터 표시
initialData	초기에 캐시에 있는 데이터로 표시
throwOnError	에러를 ErrorBoundary로 전달
4. gcTime과 staleTime의 차이
항목	의미	기본값	역할
staleTime	데이터가 신선하다고 간주되는 기간	0	refetch 기준
gcTime	데이터가 비활성 후 캐시에서 삭제되기까지의 기간	5분	메모리 관리

동작 흐름

데이터 패칭 완료 후 일정 시간 동안 fresh 유지 (staleTime 동안).

staleTime이 지나면 stale 상태로 전환되고, 포커스 복귀나 이벤트 시 refetch.

쿼리가 더 이상 사용되지 않으면 inactive 상태로 전환.

gcTime이 지나면 캐시에서 완전히 제거.

5. 캐싱 전략

데이터 변경 주기

자주 변경되는 데이터 → staleTime 짧게 설정

거의 변경되지 않는 데이터 → staleTime 길게 설정

데이터 재사용 가능성

여러 컴포넌트에서 재사용되는 데이터 → gcTime 길게

한 번만 사용하는 데이터 → gcTime 짧게

상황	staleTime	gcTime	전략
실시간 데이터 (주가, 채팅 등)	0~10초	1분	최신성 우선
사용자 정보 / 프로필	5~30분	1시간	캐시 재활용
게시글 목록 등 중간 빈도 데이터	1~5분	30분	적절한 캐시 유지
정적 데이터 (공지, 설정값 등)	Infinity	Infinity	캐시 영구 유지
테스트 / 임시 데이터	0	30초	빠른 캐시 제거
6. useInfiniteQuery

useInfiniteQuery는 페이지 단위로 데이터를 불러오며, 무한 스크롤 기능 구현에 사용된다.
getNextPageParam으로 다음 페이지 정보를 계산하고,
fetchNextPage, hasNextPage 등의 상태를 제공한다.

useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage, allPages) =>
    lastPage.length < 10 ? undefined : allPages.length + 1,
});


데이터 구조

{
  pages: [[page1], [page2], [page3]],
  pageParams: [1, 2, 3]
}

7. 페이지네이션 방식

오프셋 기반 (Offset-based)

OFFSET과 LIMIT으로 페이지 지정

단순하지만 깊은 페이지로 갈수록 성능 저하

데이터 추가 시 중복·누락 가능

커서 기반 (Cursor-based)

“마지막 데이터 이후” 기준으로 요청 (WHERE id < lastId)

빠르고 일관성 높음

무한 스크롤 구현에 적합

특정 페이지 점프 불가

8. Skeleton UI

Skeleton UI는 로딩 중 실제 콘텐츠 대신 **자리 표시자(회색 뼈대)**를 보여주는 기법이다.
사용자에게 로딩 상태를 직관적으로 전달하며, 빈 화면보다 긍정적인 피드백을 제공한다.

장점
체감 로딩 시간 감소
사용자 이탈률 감소
시각적 일관성 유지
시스템 동작 피드백 제공

단점
추가 개발 리소스 필요
짧은 로딩 시 깜빡임 발생
실제 UI와 불일치 시 혼란 유발

