import { FactionState } from './faction.model';
import { PileState } from './pile.model';
import { AreaState } from './area.model';
import { PlayerState } from './player.model';
import { Observable } from 'rxjs';

export interface GlobalState {
  player: PlayerState[];
}

/**
 * Defining the GameState object managed by GameStateStoreService
 */
export interface GameState {
  area: AreaState[];
  faction: FactionState[];
  global: GlobalState;
  pile: PileState[];
}

export const emptyGameState: GameState = {
  area: [],
  faction: [],
  global: {
    player: [],
  },
  pile: [],
};

export interface GameElementState {
  id: string;
}

export interface GameElement {
  id: string;
  state: GameElementState;
  state$: Observable<GameElementState>;
  setState(state: GameElementState): void;
}
