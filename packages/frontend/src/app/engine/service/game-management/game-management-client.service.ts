import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Game, GameCollection } from 'api-types/src/game';
import { lastValueFrom } from 'rxjs';
import { Player, PlayerCollection } from 'api-types/src/player';

@Injectable({
  providedIn: 'root',
})
export class GameManagementClientService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  async createGame(game: Game): Promise<void> {
    await lastValueFrom(this.http.post('/game', game));
  }

  async getGamesForLoggedInPlayer(): Promise<Game[]> {
    const gameCollection = await lastValueFrom(
      this.http.get<GameCollection>('/game', {
        params: { username: this.authService.loggedInUsername },
      }),
    );
    return gameCollection.games;
  }

  async completeGame(gameId: string): Promise<void> {
    await lastValueFrom(this.http.patch(`/game/${gameId}`, { complete: true }));
  }

  async getPlayer(username: string): Promise<Player> {
    return await lastValueFrom(this.http.get<Player>(`/player/${username}`));
  }

  async getLoggedInPlayer(): Promise<Player> {
    return await this.getPlayer(this.authService.loggedInUsername);
  }

  async findPlayers(username: string): Promise<Player[]> {
    const playerCollection = await lastValueFrom(
      this.http.get<PlayerCollection>('/player', {
        params: { username: username },
      }),
    );
    return playerCollection.players;
  }

  async setFriends(player: Player): Promise<void> {
    await lastValueFrom(this.http.patch(`/player/${player.username}`, { friends: player.friends }));
  }
}
