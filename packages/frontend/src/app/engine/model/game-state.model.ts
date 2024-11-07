import { GameElementStates, GameState } from 'api-types/src/game-state';

export const emptyGameElementStates: GameElementStates = {
  area: [],
  faction: [],
  pile: [],
}

// current used to initialize GameStoreService, but should be refactored to get the Initial Game State when user joins the game.
export const emptyGameState: GameState = {
  gameId: 'placeholder',
  patchId: 0,
  playerIds: [],
  gameElements: emptyGameElementStates
};

export function getEmptyInitialGameState(gameId: string, playerIds: string[]): GameState {
  return {
    gameId: gameId,
    patchId: 0,
    playerIds: playerIds,
    gameElements: emptyGameElementStates,
  };
}

export interface InitialGameElementStatesFactory {
  build(playerIds: string[]): GameElementStates;
}

export type InitialGameElementStatesFactoryConstructor = new () => InitialGameElementStatesFactory;
