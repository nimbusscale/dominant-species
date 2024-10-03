import {PileState} from '../model/pile.model';
import {BehaviorSubject, distinctUntilChanged, map, Observable} from 'rxjs';
import {FactionState} from '../model/faction.model';
import {GameState, GameStateElement} from '../model/game-state.model';
import {Injectable} from "@angular/core";
import { deepClone } from 'fast-json-patch';

@Injectable({
  providedIn: 'root',
})
export class GameStateStoreService {
  private gameState: GameState;
  private transactionState: GameState | null = null
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

  private setTransactionStateElement(key: keyof GameState, newState: GameStateElement): void {
    if (!this.transactionState) {
      throw new Error('Must start transaction before updating state.')
    }
    const subStateArray = this.transactionState[key] as (typeof newState)[];
    const index = subStateArray.findIndex((item) => item.kind === newState.kind);

    if (index > -1) {
      subStateArray[index] = newState;
    } else {
      subStateArray.push(newState);
    }
  }

  setGameState(newState: GameState) {
    this.gameState = newState;
    this.gameStateSubject.next(this.gameState);
  }

  startTransaction(): void {
    if (!this.transactionState) {
      this.transactionState = deepClone(this.gameState)
    } else {
      throw new Error("Can't start transaction and one already in progress.")
    }

  }

  commitTransaction(): void {
    if (this.transactionState) {
      this.gameState = this.transactionState
      this.transactionState = null
      this.gameStateSubject.next(this.gameState);
    } else {
      throw new Error('No transaction in progress to commit')
    }
  }

  rollbackTransaction(): void {
    if (this.transactionState) {
      this.transactionState = null
      // Ensures gameState is a new object so that subscribers can detect the update
      this.gameState = deepClone(this.gameState)
      this.gameStateSubject.next(this.gameState);
    } else {
      throw new Error('No transaction in progress to rollback')
    }
  }

  faction$(): Observable<FactionState[]> {
    return this.getObservableForKey((gameState) => gameState.faction);
  }

  setFaction(newState: FactionState): void {
    this.setTransactionStateElement('faction', newState)
  }

  pile$(): Observable<PileState<string>[]> {
    return this.getObservableForKey((gameState) => gameState.pile);
  }

  setPile(newState: PileState<string>): void {
    this.setTransactionStateElement('pile', newState)
  }
}
