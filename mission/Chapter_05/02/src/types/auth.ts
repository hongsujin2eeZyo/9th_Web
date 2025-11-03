export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
};


