import {PileState} from '../model/pile.model';
import {BehaviorSubject, distinctUntilChanged, map, Observable} from 'rxjs';
import {FactionState} from '../model/faction.model';
import {GameState, GameStateElement} from '../model/game-state.model';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class GameStateStoreService {
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
  private objectsEqual(first: unknown, second: unknown): boolean {
    return JSON.stringify(first) === JSON.stringify(second);
  }

  private getObservableForKey<T>(selector: (state: GameState) => T): Observable<T> {
    return this.gameStateSubject.asObservable().pipe(
      map(selector),
      distinctUntilChanged((previous, current) => this.objectsEqual(previous, current)),
    );
  }

  private setGameStateElement(key: keyof GameState, newState: GameStateElement): void {
    const subStateArray = this.gameState[key] as (typeof newState)[];
    const index = subStateArray.findIndex((item) => item.kind === newState.kind);

    if (index > -1) {
      subStateArray[index] = newState;
    } else {
      subStateArray.push(newState);
    }
  }

  // Will be replaced by function that will update state via GSP/
  setState(newState: GameState) {
    this.gameState = newState;
    this.gameStateSubject.next(this.gameState);
  }

  factionState$(): Observable<FactionState[]> {
    return this.getObservableForKey((gameState) => gameState.faction);
  }

  pileState$(): Observable<PileState<string>[]> {
    return this.getObservableForKey((gameState) => gameState.pile);
  }

  setPileState(newState: PileState<string>): void {
    const index = this.gameState.pile.findIndex((item) => item.kind === newState.kind);
    if (index > -1) {
      this.gameState.pile[index] = newState;
    } else {
      this.gameState.pile.push(newState);
    }
  }
}
