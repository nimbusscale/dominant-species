import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { deepClone } from 'fast-json-patch';
import { baseGameState } from '../../game/dominant-species.constants';
import { GameState } from '../model/game-state.model';
import { Animal } from '../../game/model/animal.model';

@Injectable({
  providedIn: 'root',
})
export class GameManagementService {
  constructor(private gameStateService: GameStateService) {}

  createGame(): void {
    const gameState = deepClone(baseGameState) as GameState;
    gameState.faction = [
      {
        owner: {
          id: 'test1',
          name: 'Tester1',
        },
        kind: 'birdAnimal',
      } as Animal,
      {
        owner: {
          id: 'test2',
          name: 'Tester2',
        },
        kind: 'mammalAnimal',
      } as Animal,
    ];
    this.gameStateService.initializeGameState(gameState);
  }
}
