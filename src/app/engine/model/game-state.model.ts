import { FactionState } from './faction.model';
import { PileState } from './pile.model';
import { AreaState } from './area.model';

/**
 * Defining the GameState object managed by GameStateStoreService
 */
export interface GameState {
  area: AreaState[];
  faction: FactionState[];
  pile: PileState[];
}

export const emptyGameState: GameState = {
  area: [],
  faction: [],
  pile: [],
};
