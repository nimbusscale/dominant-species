import { PileState } from './pile.model';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import {FactionState} from "./faction.model";

export interface GameState {
  pile: PileState<string>[];
}

export class GameStateStore {
  private gameState: GameState;
  private gameStateSubject: BehaviorSubject<GameState>;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.gameStateSubject = new BehaviorSubject<GameState>(this.gameState);
  }

  /**
   * Compares two objects to determine if they are equal.
   * Current done by dumps to JSON and compare strings, but not sure about performance or accuracy, may need to look into a better method in the future.
   * @returns - True if objects are the same, otherwise false
   * @private
   */
  private objectsEqual(first: any, second: any): boolean {
    return JSON.stringify(first) === JSON.stringify(second)
  }

  // Will be replaced by function that will update state via GSP/
  setState(newState: GameState) {
    this.gameState = newState;
    this.gameStateSubject.next(this.gameState);
  }

  pileState$(): Observable<PileState<string>[]> {
    return this.gameStateSubject.asObservable().pipe(
      // Map to only the pile property from the GameState
      map((gameState) => gameState.pile),
      // Compare previous and current piles to emit only when piles change
      distinctUntilChanged(
        (previousPile, currentPile) => this.objectsEqual(previousPile, currentPile),
      ),
    );
  }
}
