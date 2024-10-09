import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Pile } from '../model/pile.model';
import { skip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PileStateService {
  private registeredPileIds: Set<string> = new Set<string>();
  private pileById: Map<string, Pile> = new Map<string, Pile>();

  constructor(private gameStateSvc: GameStateService) {
    this.initialize();
  }

  private initialize(): void {
    this.gameStateSvc.pile$.subscribe((pileStates) => {
      pileStates.forEach((pileState) => {
        if (this.registeredPileIds.has(pileState.id)) {
          const pile = this.getPile(pileState.id);
          pile.setState(pileState);
        }
      });
    });
  }

  private getPile(id: string): Pile {
    const pile = this.pileById.get(id);
    if (!pile) {
      throw new Error(`Pile for id ${id} is not registered.`);
    } else {
      return pile;
    }
  }

  register(piles: Pile[]): void {
    piles.forEach((pile) => {
      if (!this.registeredPileIds.has(pile.id)) {
        this.registeredPileIds.add(pile.id);
        this.pileById.set(pile.id, pile);
        this.gameStateSvc.registerPile(pile.state);
        // We skip the first value as we just registered the pile and state updates can only happen during a transaction
        pile.state$.pipe(skip(1)).subscribe((pileState) => {
          this.gameStateSvc.setPile(pileState);
        });
      } else {
        throw new Error(`Pile for id ${pile.id} already registered.`);
      }
    });
  }
}
