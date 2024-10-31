import { Injectable } from '@angular/core';
import { Player } from 'api-types/src/player';
import { AuthService } from '../auth/auth.service';
import { GameManagementClientService } from './game-management-client.service';
import { ensureDefined } from '../../util/misc';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  currentPlayer: Player | undefined = undefined;
  private currentPlayerSubject: BehaviorSubject<Player | undefined> = new BehaviorSubject<
    Player | undefined
  >(this.currentPlayer);
  currentPlayer$ = this.currentPlayerSubject.asObservable();

  constructor(
    private authService: AuthService,
    private gameManagementClientService: GameManagementClientService,
  ) {
    this.authService.isLoggedIn$.pipe().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.gameManagementClientService
          .getLoggedInPlayer()
          .then((player) => {
            this.currentPlayer = player;
            this.currentPlayerSubject.next(this.currentPlayer);
          })
          .catch((error: unknown) => {
            throw error;
          });
      } else {
        this.currentPlayer = undefined;
        this.currentPlayerSubject.next(this.currentPlayer);
      }
    });
  }

  async findPlayers(username: string): Promise<string[]> {
    const playerCollection = await this.gameManagementClientService.findPlayers(username);
    return playerCollection.map((player) => player.username);
  }

  async addfriend(username: string): Promise<void> {
    ensureDefined(this.currentPlayer).friends.push(username);
    await this.gameManagementClientService.setFriends(ensureDefined(this.currentPlayer));
    this.currentPlayerSubject.next(this.currentPlayer);
  }

  async removeFriend(username: string): Promise<void> {
    ensureDefined(this.currentPlayer).friends = ensureDefined(this.currentPlayer).friends.filter(
      (friendUsername) => friendUsername !== username,
    );
    await this.gameManagementClientService.setFriends(ensureDefined(this.currentPlayer));
    this.currentPlayerSubject.next(this.currentPlayer);
  }
}
