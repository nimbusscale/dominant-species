import { Injectable } from '@angular/core';
import { GameStateStoreService } from './game-state-store.service';
import { GameStatePatchService } from './game-state-patch.service';
import { GameStateClientService } from './game-state-client.service';
import { Observable } from 'rxjs';
import { FactionState } from '../model/faction.model';
import { PileState } from '../model/pile.model';
import { GameStatePatch } from '../model/game-state-patch.model';

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
    this.gameStateClient.gsp$.subscribe((gsp) => {
      if (gsp) {
        this.applyGsp(gsp);
      }
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
    if (this.gameStateStore.transactionState) {
      const gsp = this.gspService.create(
        this.gameStateStore.gameState,
        this.gameStateStore.transactionState,
      );
      this.gameStateStore.commitTransaction();
      this.gameStateClient.sendGspToBackend(gsp);
    } else {
      throw new Error('No transaction in progress to commit');
    }
  }

  rollbackTransaction(): void {
    this.gameStateStore.rollbackTransaction();
  }

  get faction$(): Observable<FactionState[]> {
    return this.gameStateStore.faction$;
  }

  setFaction(newState: FactionState): void {
    this.gameStateStore.setFaction(newState);
  }

  get pile$(): Observable<PileState<string>[]> {
    return this.gameStateStore.pile$;
  }

  setPile(newState: PileState<string>): void {
    this.gameStateStore.setPile(newState);
  }
}