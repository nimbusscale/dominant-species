import { PlayerState } from './player.model';
import { GameStateElement } from './game-state.model';

export interface FactionState extends GameStateElement {
  owner: PlayerState;
  score: number
}
