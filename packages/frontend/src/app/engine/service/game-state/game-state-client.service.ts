import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import {GameStatePatch} from "api-types/src/game-state";

@Injectable({
  providedIn: 'root',
})
export class GameStateClientService {
  sendGspToBackend(gsp: GameStatePatch): void {
    console.log(JSON.stringify(gsp));
  }

  get gsp$(): Observable<GameStatePatch | undefined> {
    return of(undefined);
  }
}
