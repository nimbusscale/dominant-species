import { Injectable } from '@angular/core';
import { applyPatch, compare } from 'fast-json-patch';
import {GameElementStates, GameState, GameStatePatch} from "api-types/src/game-state";

/**
 * Creates and applies GameStatePatches
 */
@Injectable({
  providedIn: 'root',
})
export class GameStatePatchService {
  create(oldState: GameElementStates, newState: GameElementStates): GameStatePatch {
    return {
      timeStamp: Date.now(),
      patch: compare(oldState, newState),
    };
  }

  apply(oldState: GameElementStates, gsp: GameStatePatch): GameElementStates {
    return applyPatch(oldState, gsp.patch, undefined, false).newDocument;
  }
}
