import { Player } from './player.model';
import { GameStateElement } from './game-state.model';

export type FactionState = GameStateElement & {
  owner: Player;
};
