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

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  company_name?: string;
  phone_number?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}