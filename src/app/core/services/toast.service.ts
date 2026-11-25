
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    type: ToastType;
    message: string;
    statusCode?: number;
}

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private toastSubject = new BehaviorSubject<ToastMessage | null>(null);

    toast$ = this.toastSubject.asObservable();

    private timeoutId: ReturnType<typeof setTimeout> | null = null;

    showSuccess(message: string): void {
        this.show(message, 'success');
    }

    showError(message: string, statusCode?: number): void {
        this.show(message, 'error', statusCode);
    }

    showInfo(message: string): void {
        this.show(message, 'info');
    }

    dismiss(): void {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.toastSubject.next(null);
    }

    private show(
        message: string,
        type: ToastType,
        statusCode?: number,
    ): void {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }

        this.toastSubject.next({
            message,
            type,
            statusCode,
        });

        this.timeoutId = setTimeout(() => {
            this.dismiss();
        }, 4000);
    }
}
