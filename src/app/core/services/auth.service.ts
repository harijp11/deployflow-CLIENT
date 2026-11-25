
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthApiResponse,
} from '../models/auth.model';

import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);

  private readonly authUrl = environment.apiUrl;

  // Login
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.tokenStorage.saveSession({
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            user: response.user,
          });
        }),
      );
  }

  // Register
  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.authUrl}/auth/register`,
      payload,
    );
  }

  // Verify Email
  verifyEmail(payload: VerifyEmailRequest): Observable<VerifyEmailResponse> {
    return this.http.post<VerifyEmailResponse>(
      `${this.authUrl}/auth/verify-email`,
      payload,
    );
  }

  resendVerificationEmail(payload: { email: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.authUrl}/auth/resend-verification`,
      payload,
    );
  }

  forgotPassword(email: string) {
  const payload: ForgotPasswordRequest = { email };

  return this.http.post<AuthApiResponse>(
    `${this.authUrl}/auth/forgot-password`,
    payload
  );
}

resetPassword(token: string, newPassword: string) {
  const payload: ResetPasswordRequest = {
    token,
    new_password: newPassword,
  };

  return this.http.post<AuthApiResponse>(
    `${this.authUrl}/auth/reset-password`,
    payload
  );
}

  // Logout
  logout(): Observable<unknown> {
    return this.http.post(`${this.authUrl}/auth/logout`, null);
  }

  // Authentication status
  isAuthenticated(): boolean {
    return this.tokenStorage.isAuthenticated();
  }

  // Clear session
  clearSession(): void {
    this.tokenStorage.clearSession();
  }
}

