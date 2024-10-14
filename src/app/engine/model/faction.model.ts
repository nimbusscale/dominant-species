import { GameElement, GameElementState } from './game-element.model';

export interface FactionState extends GameElementState {
  name: string;
  ownerId: string;
  score: number;
}

export class Faction extends GameElement<FactionState> {
  get name(): string {
    return this._state.name;
  }

  get ownerId(): string {
    return this._state.ownerId;
  }

  get score(): number {
    return this._state.score;
  }

  increaseScore(amount: number): void {
    this._state.score += amount;
    this.emitState();
  }

  decreaseScore(amount: number): void {
    this._state.score -= amount;
    this.emitState();
  }

  setScore(amount: number): void {
    this._state.score = amount;
    this.emitState();
  }
}
