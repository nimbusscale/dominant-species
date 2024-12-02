import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { getEmptyInitialGameState } from '../../model/game-state.model';
import { Injectable } from '@angular/core';
import { deepClone } from 'fast-json-patch';

import {
  AreaState,
  FactionState,
  GameElementState,
  GameElementStates,
  GameState,
  PileState,
} from 'api-types/src/game-state';
import { ensureDefined } from '../../util/misc';

/**
 * GameStateStoreService is responsible for maintain the GameState and making it accessible to others.
 *
 * When a GameStateStoreService is instantiated, it does not have a GameState, and it must be initialized with a GameState before it
 * can be used.
 *
 * The GameState has several top level keys, and GameStateStoreService provides observables for each of those keys.
 * So if someone was interested in the pile key, then they could subscribe to the pile$ observable.
 * A value will be emitted on each observable whenever the GameState is updated, regardless of if the particular key has been updated.
 *
 * The GameState can be updated in one of two ways:
 *
 * 1.) Via the setGameState method which will takes an entire GameState object and overwrites the previous GameState object. All observables
 * will then emit the values from the new GameState object. This method is typically used when the GameState is updated based on a received GSP.
 *
 * 2.) Via a transaction, which is typically done via actions taken during a turn. In this case, the startTransaction method is called and
 * the state is updated via calling one or more set methods (such as setPile) and then calling commitTransaction or rollbackTransaction.
 * In Either case, all observables will then emit the values from the new GameState object. This is to ensure that all local objects have the
 * current GameState.
 */
@Injectable({
  providedIn: 'root',
})
export class GameStateStoreService {
  private _gameState: GameState | undefined;
  private _transactionState: GameState | null = null;
  private gameStateSubject: BehaviorSubject<GameState | undefined>;

  constructor() {
    this.gameStateSubject = new BehaviorSubject<GameState | undefined>(this._gameState);
  }

  initializeGameState(gameState: GameState): void {
    this._gameState = getEmptyInitialGameState(
      gameState.gameId,
      gameState.playerIds,
      gameState.patchId,
    );
  }

  private getObservableForKey<T>(selector: (state: GameState) => T[]): Observable<T[]> {
    return this.gameStateSubject.asObservable().pipe(
      switchMap((gameState) => {
        if (gameState === undefined) {
          return of([] as T[]);
        }
        return of(selector(gameState));
      }),
    );
  }

  /**
   * Used to update the state of an already registered GameStateElement.
   * A transaction must be started.
   * @param key key of the GameState object that stores this kind of GameStateElement
   * @param newGameStateElement the GameStateElement to update. An existing GameStateElement that matches this passed in
   * GameStateElement will be updated.
   * @private
   */
  private setTransactionStateElement(
    key: keyof GameElementStates,
    newGameStateElement: GameElementState,
  ): void {
    if (!this._transactionState) {
      throw new Error('Must start transaction before updating GameState.');
    }
    const subStateArray = this._transactionState.gameElements[
      key
    ] as (typeof newGameStateElement)[];
    const index = subStateArray.findIndex((item) => item.id === newGameStateElement.id);

    if (index > -1) {
      subStateArray[index] = newGameStateElement;
    } else {
      throw new Error(`State Element ${JSON.stringify(newGameStateElement)} not registered`);
    }
  }

  /**
   * Used to register a new GameStateElement.
   * A transaction must NOT be started. Cannot register the same GameStateElement more than once.
   * @param key key of the GameState object that stores this kind of GameStateElement
   * @param newGameStateElement the GameStateElement to register.
   * @private
   */
  private registerTransactionStateElement(
    key: keyof GameElementStates,
    newGameStateElement: GameElementState,
  ): void {
    if (this.transactionState) {
      throw new Error('Can not register new State Elements while a transaction is in progress.');
    }
    const subStateArray = ensureDefined(this._gameState).gameElements[
      key
    ] as (typeof newGameStateElement)[];
    const index = subStateArray.findIndex((item) => item.id === newGameStateElement.id);

    if (index > -1) {
      throw new Error(`State Element ${JSON.stringify(newGameStateElement)} already registered`);
    } else {
      subStateArray.push(newGameStateElement);
    }
  }

  get gameState(): GameState | undefined {
    if (this._gameState) {
      return deepClone(this._gameState) as GameState;
    } else {
      return undefined;
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

  setGameState(newState: GameState) {
    if (this._transactionState) {
      throw new Error('GameState can not be set during a transaction.');
    } else {
      this._setGameState(newState);
    }
  }

  startTransaction(): void {
    if (!this._transactionState) {
      this._transactionState = deepClone(this._gameState) as GameState;
      this._transactionState.patchId += 1;
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

  get playerIds(): string[] | undefined {
    if (this._gameState) {
      return this._gameState.playerIds;
    } else {
      return undefined;
    }
  }

  get area$(): Observable<AreaState[]> {
    return this.getObservableForKey((gameState) => gameState.gameElements.area);
  }

  setArea(newState: AreaState): void {
    this.setTransactionStateElement('area', newState);
  }

  registerArea(newState: AreaState): void {
    this.registerTransactionStateElement('area', newState);
  }

  get faction$(): Observable<FactionState[]> {
    return this.getObservableForKey((gameState) => gameState.gameElements.faction);
  }

  setFaction(newState: FactionState): void {
    this.setTransactionStateElement('faction', newState);
  }

  registerFaction(newState: FactionState): void {
    this.registerTransactionStateElement('faction', newState);
  }

  get pile$(): Observable<PileState[]> {
    return this.getObservableForKey((gameState) => gameState.gameElements.pile);
  }

  setPile(newState: PileState): void {
    this.setTransactionStateElement('pile', newState);
  }

  registerPile(newState: PileState): void {
    this.registerTransactionStateElement('pile', newState);
  }
}
