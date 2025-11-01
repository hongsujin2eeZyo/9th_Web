
export const setToken = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  
  export const getToken = (key: string = "accessToken") => {
    return localStorage.getItem(key);
  };
  
  export const removeToken = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
  