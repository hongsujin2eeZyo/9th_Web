export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}


export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
};


