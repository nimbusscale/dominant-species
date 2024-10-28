import { Injectable } from '@angular/core';
import {humanId} from 'human-id'
import {GameManagementClientService} from "./game-management-client.service";
import {AuthService} from "../auth/auth.service";
import {lastValueFrom} from "rxjs";
import {Game} from "api-types/src/game";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private authService: AuthService,
    private gameManagementClientService: GameManagementClientService
  ) { }


  async createGame(otherPlayers: string[]): Promise<string> {
    const gameId = humanId()
    await this.gameManagementClientService.createGame({
        gameId,
        host: this.authService.loggedInUsername,
        players: [this.authService.loggedInUsername, ...otherPlayers]
      }

    )
    console.log(`created game: ${gameId}`);
    return gameId
  }

  async getGamesForLoggedInPlayer(): Promise<Game[]> {
    return await this.gameManagementClientService.getGamesForLoggedInPlayer();
  }

  async completeGame(gameId: string): Promise<void> {
    return await this.gameManagementClientService.completeGame(gameId);
  }
}
