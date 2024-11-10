import { Injectable } from '@angular/core';
import { humanId } from 'human-id';
import { GameManagementClientService } from './game-management-client.service';
import { AuthService } from '../auth/auth.service';
import { Game } from 'api-types/src/game';
import { GameStateInitializationService } from '../game-state/game-state-initialization.service';
import { GameTitle } from '../../constant/game-title.constant';
import { FactionRegistryService } from '../game-element/faction-registry.service';
import { AreaRegistryService } from '../game-element/area-registry.service';
import { PileRegistryService } from '../game-element/pile-registry.service';
import { Area } from '../../model/area.model';
import { Faction } from '../../model/faction.model';
import { Pile } from '../../model/pile.model';
import { NavigateService } from '../navigate.service';
import { GameStateService } from '../game-state/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private navigate: NavigateService,
    private authService: AuthService,
    private gameManagementClientService: GameManagementClientService,
    private gameStateService: GameStateService,
    private gameStateInitializationService: GameStateInitializationService,
    private areaRegistryService: AreaRegistryService,
    private factionRegistryService: FactionRegistryService,
    private pileRegistryService: PileRegistryService,
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

  async joinGame(gameId: string): Promise<void> {
    await this.navigate.toGamePage(GameTitle.DOMINANT_SPECIES, gameId);
  }

  async initializeGame(gameId: string): Promise<void> {
    const gameState = await this.gameManagementClientService.getLatestGameState(gameId);
    this.gameStateService.initializeGameState(gameState);
    gameState.gameElements.area.forEach((areaState) => {
      this.areaRegistryService.register(new Area(areaState));
    });
    gameState.gameElements.faction.forEach((state) => {
      this.factionRegistryService.register(new Faction(state));
    });
    gameState.gameElements.pile.forEach((state) => {
      this.pileRegistryService.register(new Pile(state));
    });
  }

  cleanupGame(): void {
    this.gameStateService.disconnectFromBackend();
  }
}
