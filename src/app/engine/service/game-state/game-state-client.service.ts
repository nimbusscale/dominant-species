import { Injectable } from '@angular/core';
import { GameStatePatch } from '../../model/game-state-patch.model';
import { of, Observable } from 'rxjs';

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
