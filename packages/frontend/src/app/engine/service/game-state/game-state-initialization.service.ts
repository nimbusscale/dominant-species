import { Inject, Injectable, Optional } from '@angular/core';
import {
  getEmptyInitialGameState,
  InitialGameElementStatesFactoryConstructor,
} from '../../model/game-state.model';
import { GameTitle } from '../../constant/game-title.constant';
import { GameElementStatesFactoryService } from '../../../game/service/game-element-states-factory.service';
import { GameState } from 'api-types/src/game-state';

const FACTORY_MAP = new Map<string, InitialGameElementStatesFactoryConstructor>([
  [GameTitle.DOMINANT_SPECIES, GameElementStatesFactoryService],
]);

@Injectable({
  providedIn: 'root',
})
export class GameStateInitializationService {
  private readonly factoryByGameTitle: Map<string, InitialGameElementStatesFactoryConstructor>;

  constructor(
    @Optional()
    @Inject('FACTORY_MAP')
    factoryMap: Map<string, InitialGameElementStatesFactoryConstructor> | null,
  ) {
    this.factoryByGameTitle = factoryMap ?? FACTORY_MAP;
  }

  build(gameTitle: string, gameId: string, playerIds: string[]): GameState {
    const gameState = getEmptyInitialGameState(gameId, playerIds);
    const gameElementsFactoryClass = this.factoryByGameTitle.get(gameTitle);
    if (gameElementsFactoryClass) {
      const gameElementsFactory = new gameElementsFactoryClass();
      gameState.gameElements = gameElementsFactory.build(playerIds);
      return gameState;
    } else {
      throw new Error(`Unable to build initial state for ${gameTitle}`);
    }
  }
}
