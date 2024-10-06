import { PileState } from '../model/pile.model';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { FactionState } from '../model/faction.model';
import { GameState, GameStateElement } from '../model/game-state.model';
import { Injectable } from '@angular/core';
import { deepClone } from 'fast-json-patch';

/**
 * GameStateStoreService is responsible for maintain the GameState and making it accessible to others.
 *
 * A GameStateStoreService cannot be used until the initializeGameState method is called an initial GameState is passed in.
 *
 * The GameState has several top level keys, and GameStateStoreService provides observables for each of those keys.
 * So if someone was interested in the faction key, then they could subscribe to the faction$ observable.
 * A value will be emitted on each observable whenever the GameState is updated, regardless of if the particular key has been updated.
 *
 * The GameState can be updated in one of two ways:
 *
 * 1.) Via the setGameState method which will takes an entire GameState object and overwrites the previous GameState object. All observables
 * will then emit the values from the new GameState object. This method is typically used when the GameState is updated based on a received GSP.
 *
 * 2.) Via a transaction, which is typically done via actions taken during a turn. In this case, the startTransaction method is called and
 * the state is updated via calling one or more set methods (such as setFaction) and then calling commitTransaction or rollbackTransaction.
 * In Either case, all observables will then emit the values from the new GameState object. This is to ensure that all local objects have the
 * current GameState.
 */
@Injectable({
  providedIn: 'root',
})
export class GameStateStoreService {
  private _gameState: GameState | null = null;
  private _transactionState: GameState | null = null;
  private gameStateSubject: BehaviorSubject<GameState | null>;

  constructor() {
    this.gameStateSubject = new BehaviorSubject<GameState | null>(this._gameState);
  }

  private getObservableForKey<T>(selector: (state: GameState) => T): Observable<T> {
    return this.gameStateSubject.asObservable().pipe(
      filter((gameState) => gameState != null),
      map((gameState) => {
        return selector(gameState);
      }),
    );
  }

  private setTransactionStateElement(key: keyof GameState, newState: GameStateElement): void {
    if (!this._transactionState) {
      throw new Error('Must start transaction before updating GameState.');
    }
    const subStateArray = this._transactionState[key] as (typeof newState)[];
    const index = subStateArray.findIndex((item) => item.kind === newState.kind);

    if (index > -1) {
      subStateArray[index] = newState;
    } else {
      subStateArray.push(newState);
    }
  }

  get gameState(): GameState | null {
    if (this._gameState) {
      return deepClone(this._gameState) as GameState;
    } else {
      return null;
    }
  }

  get transactionState(): GameState | null {
    if (this._transactionState) {
      return deepClone(this._transactionState) as GameState;
    } else {
      return null;
    }
  }

  private _setGameState(newState: GameState) {
    this._gameState = newState;
    this.gameStateSubject.next(this.gameState);
  }

  initializeGameState(gameState: GameState): void {
    if (!this._gameState) {
      this._setGameState(gameState);
    } else {
      throw new Error('GameState all ready initialized.');
    }
  }

  setGameState(newState: GameState) {
    if (!this._gameState) {
      throw new Error('GameState must be initialized before it can be set.');
    } else if (this._transactionState) {
      throw new Error('GameState can not be set during a transaction.');
    } else {
      this._setGameState(newState);
    }
  }

  startTransaction(): void {
    if (!this._transactionState) {
      this._transactionState = deepClone(this._gameState) as GameState;
    } else {
      throw new Error("Can't start transaction as one already in progress.");
    }
  }

  commitTransaction(): void {
    if (this._transactionState) {
      this._setGameState(this._transactionState);
      this._transactionState = null;
    } else {
      throw new Error('No transaction in progress to commit');
    }
  }

  rollbackTransaction(): void {
    if (this._transactionState) {
      this._transactionState = null;
      // Ensures gameState is a new object so that subscribers can detect the update
      this._setGameState(deepClone(this._gameState) as GameState);
    } else {
      throw new Error('No transaction in progress to rollback');
    }
  }

  get faction$(): Observable<FactionState[]> {
    return this.getObservableForKey((gameState) => gameState.faction);
  }

  setFaction(newState: FactionState): void {
    this.setTransactionStateElement('faction', newState);
  }

  get pile$(): Observable<PileState[]> {
    return this.getObservableForKey((gameState) => gameState.pile);
  }

  setPile(newState: PileState): void {
    this.setTransactionStateElement('pile', newState);
  }
}
