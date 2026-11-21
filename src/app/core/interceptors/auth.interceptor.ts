
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);

  const token = tokenStorage.getAccessToken();

  // No token available: continue without Authorization header.
  if (!token) {
    return next(req);
  }

  const isAuthRequest = req.url.startsWith(environment.services.auth);
  const isUserRequest = req.url.startsWith(environment.services.user);

  // Only attach the token to requests targeting our backend services.
  if (!isAuthRequest && !isUserRequest) {
    return next(req);
  }

  // Login and other public authentication endpoints don't need the access token.
  const publicAuthEndpoints = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ];

  if (
    isAuthRequest &&
    publicAuthEndpoints.some((endpoint) => req.url.startsWith(`${environment.services.auth}${endpoint}`))
  ) {
    return next(req);
  }

  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authRequest);
};
