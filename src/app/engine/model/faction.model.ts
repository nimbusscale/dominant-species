import { GameElementState } from './game-state.model';

export interface FactionState extends GameElementState {
  ownerId: string;
  score: number;
}
