import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  token = '';
  isLoading = false;
  isTokenInvalid = false;

  showPassword = false;
  showConfirmPassword = false;

  resetPasswordForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')?.trim() || '';

    if (!this.token) {
      this.isTokenInvalid = true;
    }
  }

  get newPassword() {
    return this.resetPasswordForm.controls.newPassword;
  }

  get confirmPassword() {
    return this.resetPasswordForm.controls.confirmPassword;
  }

  get passwordsDoNotMatch(): boolean {
    return (
      this.confirmPassword.touched &&
      this.confirmPassword.value !== this.newPassword.value
    );
  }

  onSubmit(): void {
    if (this.isTokenInvalid) {
      return;
    }

    if (this.resetPasswordForm.invalid || this.passwordsDoNotMatch) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService
      .resetPassword(this.token, this.newPassword.value)
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          this.toastService.showSuccess(response.message);

          this.router.navigate(['/login'], {
            queryParams: { passwordReset: 'success' },
          });
        },
        error: (error) => {
          this.isLoading = false;

          const message =
            error.error?.message ||
            error.error?.error ||
            'Password reset failed. Your reset link may have expired.';

          this.toastService.showError(message, error.status);
        },
      });
  }
}