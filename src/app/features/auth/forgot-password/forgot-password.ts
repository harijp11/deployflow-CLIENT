import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isLoading = false;
  successMessage = '';

  forgotPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() {
    return this.forgotPasswordForm.controls.email;
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';

    const email = this.email.value.trim();

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        this.toastService.showSuccess(response.message);
      },
      error: (error) => {
        this.isLoading = false;

        const message =
          error.error?.message ||
          error.error?.error ||
          'Unable to process your request. Please try again.';

        this.toastService.showError(message, error.status);
      },
    });
  }
}