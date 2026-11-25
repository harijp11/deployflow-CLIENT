
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AuthUser, TokenResponse } from '../models/auth.model';

interface AuthSession extends TokenResponse {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private platformId = inject(PLATFORM_ID);

  private readonly storageKey = 'deployflow_auth';

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  saveSession(session: AuthSession): void {
    if (!this.isBrowser) return;

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(session)
    );
  }

  getSession(): AuthSession | null {
    if (!this.isBrowser) return null;

    const session = localStorage.getItem(this.storageKey);

    if (!session) return null;

    try {
      return JSON.parse(session) as AuthSession;
    } catch {
      this.clearSession();
      return null;
    }
  }

  getAccessToken(): string | null {
    return this.getSession()?.access_token ?? null;
  }

  getRefreshToken(): string | null {
    return this.getSession()?.refresh_token ?? null;
  }

  getUser(): AuthUser | null {
    return this.getSession()?.user ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  clearSession(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(this.storageKey);
  }
}
