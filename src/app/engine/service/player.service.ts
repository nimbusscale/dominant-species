import { Injectable } from '@angular/core';
import { Player } from '../model/player.model';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  readonly currentPlayer: Player;

  constructor(private authService: AuthService) {
    const playerAuthData = this.authService.playerAuthData;
    if (playerAuthData) {
      this.currentPlayer = new Player({
        id: playerAuthData.id,
        name: playerAuthData.id,
      });
    } else {
      throw new Error('No Auth Data to build Player');
    }
  }

  get players(): Player[] {
    return [
      this.currentPlayer,
      new Player({ id: 'test2', name: 'test2' }),
      new Player({ id: 'test3', name: 'test3' }),
    ] as const;
  }
}
