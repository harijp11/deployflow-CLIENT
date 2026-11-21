export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  email: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  field?: string;
}