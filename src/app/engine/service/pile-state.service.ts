import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Pile } from '../model/pile.model';
import { skip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PileStateService {
  private registeredPileKinds: Set<string> = new Set<string>();
  private kindToPile: Map<string, Pile> = new Map<string, Pile>();

  constructor(private gameStateSvc: GameStateService) {
    this.initialize();
  }

  private initialize(): void {
    this.gameStateSvc.pile$.subscribe((pileStates) => {
      pileStates.forEach((pileState) => {
        if (this.registeredPileKinds.has(pileState.kind)) {
          const pile = this.getPile(pileState.kind);
          pile.setState(pileState);
        }
      });
    });
  }

  private getPile(kind: string): Pile {
    const pile = this.kindToPile.get(kind);
    if (!pile) {
      throw new Error(`Pile for kind ${kind} is not registered.`);
    } else {
      return pile;
    }
  }

  register(piles: Pile[]): void {
    piles.forEach((pile) => {
      if (!this.registeredPileKinds.has(pile.kind)) {
        this.registeredPileKinds.add(pile.kind);
        this.kindToPile.set(pile.kind, pile);
        this.gameStateSvc.registerPile(pile.state);
        // We skip the first value as we just registered the pile and state updates can only happen during a transaction
        pile.state$.pipe(skip(1)).subscribe((pileState) => {
          this.gameStateSvc.setPile(pileState);
        });
      } else {
        throw new Error(`Pile for kind ${pile.kind} already registered.`);
      }
    });
  }
}
