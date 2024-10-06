import { Injectable } from '@angular/core';
import {GameStateService} from "./game-state.service";
import {PileState} from "../model/pile.model";

@Injectable({
  providedIn: 'root'
})
export class PileService {
  private kindToState: Map<string, PileState> = new Map<string, PileState>

  constructor(private gameStateSvc: GameStateService) { }

  register(pileState: PileState) {
    this.kindToState.set(pileState.kind, pileState)
  }
}
