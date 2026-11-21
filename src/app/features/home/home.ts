
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private tokenStorage = inject(TokenStorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.tokenStorage.getUser();

  // Profile dropdown states
  isProfileMenuOpen = false;
  isProfileMenuHovered = false;

  get userInitial(): string {
    return this.user?.email?.charAt(0).toUpperCase() ?? 'U';
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.finishLogout();
      },
      error: (error) => {
        console.error('Backend logout failed:', error);

        // Clear the local session even if the API request fails.
        this.finishLogout();
      },
    });
  }

  private finishLogout(): void {
    this.authService.clearSession();

    this.user = null;
    this.isProfileMenuOpen = false;
    this.isProfileMenuHovered = false;

    this.router.navigateByUrl('/login');
  }
}
