import { Injectable } from '@angular/core';
import { Pile } from '../model/pile.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { PileStateService } from './pile-state.service';

@Injectable({
  providedIn: 'root',
})
/**
 * PileService is used to interact with the Piles used within the game. It manages their local state and related game state.
 * When the game is initialized, all the Piles to be used within the game would be registered with the PileService using the register method.
 * Callers that are interested in the state of a pile, such as a Component, can subscribe to the registeredPiles$ observable to validate the
 * Pile is registered. Once that is validated, they can make calls such as to pull or put pieces from/to the pile and subscribe to updates in
 * it's length.
 */
export class PileRegistryService {
  private pileById: Map<string, Pile> = new Map<string, Pile>();
  private registeredPileIds: Set<string> = new Set<string>();
  private registeredPilesSubject = new BehaviorSubject<Set<string>>(new Set());
  /**
   * Subscribers can use this Observable to determine if the pile they have been interested has been registered. Once the pile is registered,
   * then the subscriber can subscribe to other Observables, such as those made available in kindToLengthObservables
   */
  registeredPiles$: Observable<Set<string>> = this.registeredPilesSubject.asObservable();

  constructor(private pileStateSvc: PileStateService) {}

  public get(id: string): Pile {
    const pile = this.pileById.get(id);
    if (!pile) {
      throw new Error(`Pile for kind ${id} is not registered.`);
    } else {
      return pile;
    }
  }

  register(piles: Pile[]): void {
    piles.forEach((pile) => {
      if (!this.registeredPileIds.has(pile.id)) {
        this.pileById.set(pile.id, pile);
        this.registeredPileIds.add(pile.id);
      } else {
        throw new Error(`Pile for id ${pile.id} already registered.`);
      }
    });
    this.registeredPilesSubject.next(this.registeredPileIds);
    this.pileStateSvc.register(piles);
  }
}
