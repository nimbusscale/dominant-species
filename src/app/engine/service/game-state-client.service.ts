import { Injectable } from '@angular/core';
import {GameStatePatch} from "../model/game-state-patch.model";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameStateClientService {
  private gspSubject: BehaviorSubject<GameStatePatch>

  constructor() {
    this.gspSubject = new BehaviorSubject<GameStatePatch>({
      timeStamp: Date.now(),
      patch: [
          { op: 'remove', path: '/pile/1' },
          { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
        ],
      });
  }

  sendGspToBackend(gsp: GameStatePatch): void {
    console.log(JSON.stringify(gsp))
  }

  gsp$(): Observable<GameStatePatch> {
    return this.gspSubject.asObservable()
  }
}
