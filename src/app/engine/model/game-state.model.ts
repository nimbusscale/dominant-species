import { FactionState } from './faction.model';
import { PileState } from './pile.model';

/**
 * Defining the GameState object managed by GameStateStoreService
 */
export interface GameState {
  faction: FactionState[];
  pile: PileState<string>[];
}

/**
 * GameStateElement defines the base type of state objects distributed to the various objects outside the GameStateStore.
 * An example would be each object representing a faction (e.g., animal) would have a state that defines that faction.
 * This object defining the state would be of type GameStateElement.
 *
 * A type is used instead of an interface, and some of the state objects, such as pile, are a generic and require a
 * type var which is not supported by interface.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GameStateElement = {
  kind: string;
};
