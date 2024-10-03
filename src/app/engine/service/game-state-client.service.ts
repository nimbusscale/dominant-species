import { Injectable } from '@angular/core';
import { GameStatePatch } from '../model/game-state-patch.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameStateClientService {
  private gspSubject: BehaviorSubject<GameStatePatch | null>;

  constructor() {
    this.gspSubject = new BehaviorSubject<GameStatePatch | null>(null);
  }

  sendGspToBackend(gsp: GameStatePatch): void {
    console.log(JSON.stringify(gsp));
  }

  get gsp$(): Observable<GameStatePatch | null> {
    return this.gspSubject.asObservable();
  }
}
