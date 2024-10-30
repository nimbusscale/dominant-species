import { Injectable } from '@angular/core';
import { humanId } from 'human-id';
import { GameManagementClientService } from './game-management-client.service';
import { AuthService } from '../auth/auth.service';
import { Game } from 'api-types/src/game';
import { GameStateInitializationService } from '../game-state/game-state-initialization.service';
import { GameTitle } from '../../constant/game-title.constant';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private authService: AuthService,
    private gameManagementClientService: GameManagementClientService,
    private gameStateInitializationService: GameStateInitializationService,
  ) {}

  async createGame(otherPlayers: string[]): Promise<void> {
    const gameId = humanId();
    const playerIds = [this.authService.loggedInUsername, ...otherPlayers];
    await this.gameManagementClientService.createGame({
      gameId,
      host: this.authService.loggedInUsername,
      playerIds: playerIds,
    });
    const initialGameState = this.gameStateInitializationService.build(
      GameTitle.DOMINANT_SPECIES,
      gameId,
      playerIds,
    );
    await this.gameManagementClientService.setInitialGameState(initialGameState);
    console.log(`created game: ${gameId}`);
  }

  async getGamesForLoggedInPlayer(): Promise<Game[]> {
    return await this.gameManagementClientService.getGamesForLoggedInPlayer();
  }

  async completeGame(gameId: string): Promise<void> {
    await this.gameManagementClientService.completeGame(gameId);
  }
}
