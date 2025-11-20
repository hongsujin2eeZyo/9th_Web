Debounce란 무엇인가?

Debounce는
짧은 시간 동안 여러 번 발생한 이벤트를 하나로 모아, 마지막 이벤트 이후 일정 시간(delay)이 지나면 한 번만 실행하도록 만드는 기법이다.

특징

이벤트가 여러 번 발생해도 마지막 이벤트 기준으로 한 번만 실행된다.

특정 입력이 끝난 뒤 실행되는 것이 중요할 때 적합하다.

사용 사례

검색창 자동완성: 사용자가 입력을 멈출 때 API를 한 번 호출

입력 폼 유효성 검사: 타이핑이 멈춘 뒤 검사

창 크기 조절 이벤트 처리: 연속 resize 중에는 무시하고 마지막에만 계산

동작 흐름 (예: 300ms)

입력이 연달아 들어오면 타이머가 계속 초기화된다.

입력이 멈추고 300ms가 지나면 실행된다.

Debounce 코드 예시
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: number | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

Throttling이란 무엇인가?

Throttling은
이벤트가 아무리 자주 발생해도 일정 시간(delay)마다 최대 한 번만 실행되도록 제한하는 기법이다.

특징  

이벤트가 계속 발생해도 **정해진 주기(delay)**마다 한 번만 실행된다.

실시간으로 움직임을 추적해야 하지만, 호출 횟수를 제한해야 할 때 적합하다.

사용 사례

스크롤 이벤트 처리 (infinite scroll, lazy loading 등)

마우스 이동 이벤트 처리 (드래그 구현)

window resize 이벤트

지속적인 이벤트 기반 게임 루프

동작 흐름 (예: 300ms)

처음 이벤트 발생 시 즉시 실행된다.

이후 300ms 동안은 추가 이벤트가 발생해도 무시된다.

300ms가 지나면 다음 이벤트를 다시 허용한다.

Throttle 코드 예시
function throttle<T extends (...args: any[]) => void>(func: T, delay: number) {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall < delay) {
      return;
    }

    lastCall = now;
    func(...args);
  };
}

Debounce vs Throttling 비교
항목	Debounce	Throttling
실행 시점	마지막 이벤트 뒤 일정 시간 후 1회 실행	일정 간격마다 최대 1회 실행
목적	이벤트가 끝난 후 실행	연속되는 이벤트를 일정 주기마다 실행
적합한 상황	검색 자동완성, 입력 검증	스크롤, 드래그, resize 등
장점	불필요한 호출 감소, 비용 절약	프레임 저하 방지, 실시간 반응 유지
주의점	지연이 길면 느리게 느껴질 수 있음	주기 사이 이벤트는 무시될 수 있음