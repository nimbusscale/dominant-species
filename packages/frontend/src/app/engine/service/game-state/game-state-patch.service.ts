import { Injectable } from '@angular/core';
import { applyPatch, compare, deepClone } from 'fast-json-patch';
import { GameState, GameStatePatch } from 'api-types/src/game-state';

/**
 * Creates and applies GameStatePatches
 */
@Injectable({
  providedIn: 'root',
})
export class GameStatePatchService {
  create(oldState: GameState, newState: GameState): GameStatePatch {
    return {
      gameId: oldState.id,
      patchId: oldState.patchId + 1,
      patch: compare(oldState.gameElements, newState.gameElements),
    };
  }

  apply(oldState: GameState, gsp: GameStatePatch): GameState {
    const newState = deepClone(oldState) as GameState;
    newState.gameElements = applyPatch(
      oldState.gameElements,
      gsp.patch,
      undefined,
      false,
    ).newDocument;
    newState.patchId = gsp.patchId;
    return newState;
  }
}
