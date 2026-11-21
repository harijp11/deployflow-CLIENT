
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);

  private readonly authUrl = environment.services.auth;

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
        })
      );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.authUrl}/logout`, null);
  }

  isAuthenticated(): boolean {
    return this.tokenStorage.isAuthenticated();
  }

  clearSession(): void {
    this.tokenStorage.clearSession();
  }
}
