import { Injectable } from '@angular/core';
import { GameStateStoreService } from './game-state-store.service';
import { GameStatePatchService } from './game-state-patch.service';
import { GameStateClientService } from './game-state-client.service';
import { filter, Observable } from 'rxjs';
import { FactionState } from '../../model/faction.model';
import { PileState } from '../../model/pile.model';
import { GameStatePatch } from '../../model/game-state-patch.model';
import { AreaState } from '../../model/area.model';

/**
 * The GameStateService provides an interface for the rest of the system to interact with state.
 * It does this by orchestrating the various other GameState related services.
 */
@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  constructor(
    private gameStateStore: GameStateStoreService,
    private gspService: GameStatePatchService,
    private gameStateClient: GameStateClientService,
  ) {
    this.gameStateClient.gsp$.pipe(filter((gsp) => gsp != undefined)).subscribe((gsp) => {
      this.applyGsp(gsp);
    });
  }

  private applyGsp(gsp: GameStatePatch): void {
    const updatedState = this.gspService.apply(this.gameStateStore.gameState, gsp);
    this.gameStateStore.setGameState(updatedState);
  }

  startTransaction(): void {
    this.gameStateStore.startTransaction();
  }

  commitTransaction(): void {
    if (!this.gameStateStore.transactionState) {
      throw new Error('No transaction in progress to commit');
    } else {
      const gsp = this.gspService.create(
        this.gameStateStore.gameState,
        this.gameStateStore.transactionState,
      );
      this.gameStateStore.commitTransaction();
      this.gameStateClient.sendGspToBackend(gsp);
    }
  }

  rollbackTransaction(): void {
    this.gameStateStore.rollbackTransaction();
  }

  /**
   * Will throw error if there is not a transaction in progress. Call before state updates that require a transaction.
   */
  requireTransaction(): void {
    if (!this.gameStateStore.transactionState) {
      throw new Error('Transaction has not been started.');
    }
  }

  get area$(): Observable<AreaState[]> {
    return this.gameStateStore.area$;
  }

  setArea(newState: AreaState): void {
    this.gameStateStore.setArea(newState);
  }

  registerArea(newState: AreaState): void {
    this.gameStateStore.registerArea(newState);
  }

  get faction$(): Observable<FactionState[]> {
    return this.gameStateStore.faction$;
  }

  setFaction(newState: FactionState): void {
    this.gameStateStore.setFaction(newState);
  }
  registerFaction(newState: FactionState): void {
    this.gameStateStore.registerFaction(newState);
  }

  get pile$(): Observable<PileState[]> {
    return this.gameStateStore.pile$;
  }

  setPile(newState: PileState): void {
    this.gameStateStore.setPile(newState);
  }

  registerPile(newState: PileState): void {
    this.gameStateStore.registerPile(newState);
  }
}
