const TOKEN_KEY = "auth_token";

// 토큰 가져오기
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 토큰 저장
export const setToken = (value: string): void => {
  localStorage.setItem(TOKEN_KEY, value);
};

// 토큰 삭제
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};