import { Injectable } from '@angular/core';
import { GameState } from '../../model/game-state.model';
import { GameStatePatch } from '../../model/game-state-patch.model';
import { applyPatch, compare } from 'fast-json-patch';

/**
 * Creates and applies GameStatePatches
 */
@Injectable({
  providedIn: 'root',
})
export class GameStatePatchService {
  create(oldState: GameState, newState: GameState): GameStatePatch {
    return {
      timeStamp: Date.now(),
      patch: compare(oldState, newState),
    };
  }

  apply(gameState: GameState, gsp: GameStatePatch): GameState {
    return applyPatch(gameState, gsp.patch, undefined, false).newDocument;
  }
}
