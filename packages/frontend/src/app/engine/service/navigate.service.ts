import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  constructor(private router: Router) {}

  async toCreateGamePage(): Promise<void> {
    await this.router.navigate(['/create-game']);
  }

  async toGamePage(gameTitle: string, gameId: string): Promise<void> {
    await this.router.navigate(['game', gameTitle], {
      queryParams: {
        gameId: gameId,
      },
    });
  }

  async toLobbyPage(): Promise<void> {
    await this.router.navigate(['/lobby']);
  }

  async toLoginPage(): Promise<void> {
    await this.router.navigate(['/login']);
  }

  async toSignUpConfirmPage(): Promise<void> {
    await this.router.navigate(['/sign-up-confirm']);
  }
}
