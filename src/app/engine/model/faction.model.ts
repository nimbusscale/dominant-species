import { Player } from './player.model';
import { GameStateElement } from './game-state.model';

export interface FactionState extends GameStateElement {
  owner: Player;
}
