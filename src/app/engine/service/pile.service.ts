import { Injectable } from '@angular/core';
import {GameStateService} from "./game-state.service";
import {Pile} from "../model/pile.model";
import {Piece} from "../model/piece.model";
import {BehaviorSubject, distinctUntilChanged, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PileService {
  private kindToPile: Map<string, Pile> = new Map<string, Pile>
  private registeredPileKinds: Set<string> = new Set<string>()
  private registeredPilesSubject = new BehaviorSubject<Set<string>>(new Set());
  private kindToLengthSubjects: Map<string, BehaviorSubject<number>> = new Map<string, BehaviorSubject<number>>
  kindToLengthObservables: Map<string, Observable<number>> = new Map<string, Observable<number>>
  registeredPiles$: Observable<Set<string>> = this.registeredPilesSubject.asObservable()

  constructor(private gameStateSvc: GameStateService) {
    this.initialize()
  }

  private initialize() {
    this.gameStateSvc.pile$
      .subscribe((pileStates) => {
        pileStates.forEach((pileState) => {
          const pile = this.getPile(pileState.kind)
          pile.setState(pileState)
          this.emitLength(pile)
        })
      });
  }

  private emitLength(pile: Pile): void {
    const lengthSubject = this.kindToLengthSubjects.get(pile.kind)
    if (lengthSubject) {
      lengthSubject.next(pile.length)
    } else {
      throw new Error(`Unable to find lengthSubject for pile kind ${pile.kind}`)
    }
  }

  private updateGameState(): void {
    for (const pile of this.kindToPile.values()) {
      this.gameStateSvc.setPile(pile.state)
      this.emitLength(pile)
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

  register(pile: Pile) {
    if (!this.registeredPileKinds.has(pile.kind)) {
      this.kindToPile.set(pile.kind, pile)
      this.registeredPileKinds.add(pile.kind)
      const lengthSubject = new BehaviorSubject<number>(pile.length)
      this.kindToLengthSubjects.set(pile.kind, lengthSubject)
      this.kindToLengthObservables.set(pile.kind, lengthSubject.asObservable().pipe(distinctUntilChanged()))
      this.updateGameState()
    } else {
      throw new Error(`Pile for kind ${pile.kind} already registered.`)
    }
  }

  pull(kind: string, count = 1): (Piece | null)[] {
    this.gameStateSvc.requireTransaction();
    const pile = this.getPile(kind)
    const pieces = pile.pull(count)
    this.updateGameState()
    return pieces;
  }

  put(kind: string, pieces: Piece[]): void {
    this.gameStateSvc.requireTransaction();
    const pile = this.getPile(kind)
    pile.put(pieces)
    this.updateGameState()
  }
}
