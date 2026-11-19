
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isPasswordVisible = false;
  isSubmitting = false;

  errorMessage = '';
  successMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.loginForm.getRawValue();

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message;

        console.log('Login successful');
        console.log('Access token received:', !!response.access_token);
        console.log('Refresh token received:', !!response.refresh_token);
      },

      error: (error) => {
        this.errorMessage =
          error.error?.error || 'Login failed. Please try again.';
      },

      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
