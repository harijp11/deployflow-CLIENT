
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
} from '../models/auth.model';

import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);

  private readonly authUrl = environment.services.auth;

  // Login
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/login`, payload)
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
      `${this.authUrl}/register`,
      payload,
    );
  }

  // Verify Email
  verifyEmail(payload: VerifyEmailRequest): Observable<VerifyEmailResponse> {
    return this.http.post<VerifyEmailResponse>(
      `${this.authUrl}/verify-email`,
      payload,
    );
  }

  resendVerificationEmail(payload: { email: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.authUrl}/resend-verification`,
      payload,
    );
  }

  // Logout
  logout(): Observable<unknown> {
    return this.http.post(`${this.authUrl}/logout`, null);
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
