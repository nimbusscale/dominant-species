import { Injectable } from '@angular/core';
import {retry, Subject, Subscription} from 'rxjs';
import { GameStatePatch } from 'api-types/src/game-state';
import {AuthService} from "../auth/auth.service";
import {ensureDefined} from "../../util/misc";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {webSocket} from "rxjs/webSocket";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class GameStateClientService {
  private websocketSubject: WebSocketSubject<GameStatePatch> | undefined = undefined
  private websocketSubscription: Subscription | undefined = undefined
  private gspSubject = new Subject<GameStatePatch>
  gsp$ = this.gspSubject.asObservable()

  constructor(private authService: AuthService) {}

  connect(gameId: string) {
    const playerAuthData = ensureDefined(this.authService.playerAuthData)
    this.websocketSubject = webSocket<GameStatePatch>({
      url: `${environment.stateEndpoint}/?token=${playerAuthData.accessToken}&gameId=${gameId}&playerId=${playerAuthData.username}`,
      serializer: (message) => JSON.stringify(message)
    })
    this.websocketSubject.pipe(retry({delay: 3000 })).subscribe((gsp) => {
      this.gspSubject.next(gsp)
    })
  }

  disconnect(): void {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe()
    }
  }

  sendGspToBackend(gsp: GameStatePatch): void {
    console.log(JSON.stringify(gsp));
  }
}
