import {GameState} from "api-types/src/game-state";

export const emptyGameState: GameState = {
  id: 'placeholder',
  patchId: 0,
  playerIds: [],
  gameElements: {
    area: [],
    faction: [],
    pile: [],
  }
};
