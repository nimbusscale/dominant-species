import { Injectable } from '@angular/core';
import {GameStateService} from "./game-state.service";
import {Pile, PileState} from "../model/pile.model";
import {Piece} from "../model/piece.model";

@Injectable({
  providedIn: 'root'
})
export class PileService {
  private kindToPile: Map<string, Pile> = new Map<string, Pile>

  constructor(private gameStateSvc: GameStateService) { }

  register(pileState: PileState) {
    if (!this.kindToPile.has(pileState.kind)) {
      this.kindToPile.set(pileState.kind, new Pile(pileState))
    } else {
      throw new Error(`Pile for kind ${pileState.kind} already registered.`)
    }
  }

  private getPile(kind: string): Pile {
    const pile = this.kindToPile.get(kind)
    if (!pile) {
      throw new Error(`Pile for kind ${kind} is not registered.`)
    } else {
      return pile
    }
  }

  pull(kind: string, count = 1): (Piece | null)[] {
    this.gameStateSvc.requireTransaction();
    const pile = this.getPile(kind)
    return pile.pull(count);
  }

  put(kind: string, pieces: Piece[]): void {
    this.gameStateSvc.requireTransaction();
    const pile = this.getPile(kind)
    pile.put(pieces)
  }
}
