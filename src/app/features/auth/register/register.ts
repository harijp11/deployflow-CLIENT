
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register implements OnDestroy {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastService = inject(ToastService);

    private countdownInterval: ReturnType<typeof setInterval> | null = null;

    isPasswordVisible = false;
    isSubmitting = false;
    isVerifying = false;
    isResending = false;

    isVerificationModalOpen = false;
    registeredEmail = '';

    // Reactive countdown: 60 seconds initially.
    resendCountdown = signal(60);

    registerForm = this.fb.nonNullable.group({
        first_name: [
            '',
            [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ],
        ],
        last_name: [
            '',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
            ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        company_name: [''],
        phone_number: [''],
    });

    verificationForm = this.fb.nonNullable.group({
        token: ['', Validators.required],
    });

    get firstName() {
        return this.registerForm.controls.first_name;
    }

    get lastName() {
        return this.registerForm.controls.last_name;
    }

    get email() {
        return this.registerForm.controls.email;
    }

    get password() {
        return this.registerForm.controls.password;
    }

    get verificationToken() {
        return this.verificationForm.controls.token;
    }

    get canResendEmail(): boolean {
        return (
            this.isVerificationModalOpen &&
            this.resendCountdown() === 0 &&
            !this.isResending
        );
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    // Start or restart the 60-second countdown.
    private startResendCountdown(): void {
        this.clearCountdown();

        this.resendCountdown.set(60);

        this.countdownInterval = setInterval(() => {
            const remaining = this.resendCountdown();

            if (remaining <= 1) {
                this.resendCountdown.set(0);
                this.clearCountdown();
                return;
            }

            this.resendCountdown.set(remaining - 1);
        }, 1000);
    }

    // Clear the countdown timer.
    private clearCountdown(): void {
        if (this.countdownInterval !== null) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    // Register.
    onSubmit(): void {
        if (this.isSubmitting || this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        const formValue = this.registerForm.getRawValue();

        const payload: RegisterRequest = {
            first_name: formValue.first_name.trim(),
            last_name: formValue.last_name.trim(),
            email: formValue.email.trim(),
            password: formValue.password,
            ...(formValue.company_name.trim() && {
                company_name: formValue.company_name.trim(),
            }),
            ...(formValue.phone_number.trim() && {
                phone_number: formValue.phone_number.trim(),
            }),
        };

        this.authService
            .register(payload)
            .pipe(
                finalize(() => {
                    this.isSubmitting = false;
                }),
            )
            .subscribe({
                next: (response) => {
                    this.registeredEmail = payload.email;

                    this.registerForm.reset();

                    this.toastService.showSuccess(
                        response.message || 'Registration successful.',
                    );

                    this.isVerificationModalOpen = true;

                    // Start countdown immediately after opening the modal.
                    this.startResendCountdown();
                },
                error: (error) => {
                    const message =
                        error.error?.error ||
                        'Registration failed. Please try again.';

                    this.toastService.showError(message, error.status);
                },
            });
    }

    // Verify email.
    onVerifyEmail(): void {
        if (this.isVerifying || this.verificationForm.invalid) {
            this.verificationForm.markAllAsTouched();
            return;
        }

        this.isVerifying = true;

        const token = this.verificationToken.value.trim();

        this.authService
            .verifyEmail({ token })
            .pipe(
                finalize(() => {
                    this.isVerifying = false;
                }),
            )
            .subscribe({
                next: (response) => {
                    this.toastService.showSuccess(
                        response.message || 'Email verified successfully.',
                    );

                    this.isVerificationModalOpen = false;

                    this.clearCountdown();

                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    const message =
                        error.error?.error ||
                        'Email verification failed. Please check your token and try again.';
                    console.log('HTTP Error:', error);
                    console.log('HTTP Status:', error.status);

                    this.toastService.showError(message, error.status);
                },
            });
    }

    // Resend verification email.
    onResendVerificationEmail(): void {
        if (!this.canResendEmail) {
            return;
        }

        this.isResending = true;

        this.authService
            .resendVerificationEmail({
                email: this.registeredEmail,
            })
            .pipe(
                finalize(() => {
                    this.isResending = false;
                }),
            )
            .subscribe({
                next: (response) => {
                    this.toastService.showSuccess(
                        response.message || 'Verification email sent successfully.',
                    );

                    // Restart countdown only after successful API response.
                    this.startResendCountdown();
                },
                error: (error) => {
                    const message =
                        error.error?.error ||
                        'Unable to resend verification email. Please try again.';

                    this.toastService.showError(message, error.status);
                },
            });
    }

    ngOnDestroy(): void {
        this.clearCountdown();
    }
}
