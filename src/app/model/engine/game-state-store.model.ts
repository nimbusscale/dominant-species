import { PileState } from './pile.model';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import {FactionState} from "./faction.model";

export interface GameState {
  faction: FactionState[]
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

  private getObservableForKey<T>(selector: (state: GameState) => T): Observable<T> {
    return this.gameStateSubject.asObservable().pipe(
      map(selector),
      distinctUntilChanged(
        (previous, current) => this.objectsEqual(previous, current),
      )
    )
  }

  // Will be replaced by function that will update state via GSP/
  setState(newState: GameState) {
    this.gameState = newState;
    this.gameStateSubject.next(this.gameState);
  }

  factionState$(): Observable<FactionState[]> {
    return this.getObservableForKey((state) => state.faction);
  }

  pileState$(): Observable<PileState<string>[]> {
    return this.getObservableForKey((state) => state.pile);
  }
}
