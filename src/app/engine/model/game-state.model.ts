import { FactionState } from './faction.model';
import { PileState } from './pile.model';

/**
 * Defining the GameState object managed by GameStateStoreService
 */
export interface GameState {
  faction: FactionState[];
  pile: PileState[];
}

export const emptyGameState: GameState = {
  faction: [],
  pile: [],
};

/**
 * GameStateElement defines the base type of state objects distributed to the various objects outside the GameStateStore.
 * An example would be each object representing a faction (e.g., animal) would have a state that defines that faction.
 * This object defining the state would be of type GameStateElement.
 */
export interface GameStateElement {
  id: string;
}
