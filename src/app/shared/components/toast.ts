
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.html',
})
export class Toast {
  toastService = inject(ToastService);
}
