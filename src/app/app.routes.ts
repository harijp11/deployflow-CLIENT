import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then((m) => m.Home),
    title: 'DeployFlow | Home',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
    title: 'DeployFlow | Login',
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.Register),
    title: 'DeployFlow | Register',
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then(
        (m) => m.ForgotPassword
      ),
    title: 'DeployFlow | Forgot Password',
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then(
        (m) => m.ResetPassword
      ),
    title: 'DeployFlow | Reset Password',
  },
  {
    path: '**',
    redirectTo: '',
  },
];