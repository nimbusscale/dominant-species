import { Injectable } from '@angular/core';
import { GameStateService } from "./game-state.service";
import { Pile } from "../model/pile.model";
import { Piece } from "../model/piece.model";
import { BehaviorSubject, distinctUntilChanged, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
/**
 * PileService is used to interact with the Piles used within the game. It manages their local state and related game state.
 * When the game is initialized, all the Piles to be used within the game would be registered with the PileService using the register method.
 * Callers that are interested in the state of a pile, such as a Component, can subscribe to the registeredPiles$ observable to validate the
 * Pile is registered. Once that is validated, they can make calls such as to pull or put pieces from/to the pile and subscribe to updates in
 * it's length.
 */
export class PileService {
  private kindToPile: Map<string, Pile> = new Map<string, Pile>();
  private registeredPileKinds: Set<string> = new Set<string>();
  private registeredPilesSubject = new BehaviorSubject<Set<string>>(new Set());
  private kindToLengthSubjects: Map<string, BehaviorSubject<number>> = new Map<string, BehaviorSubject<number>>();
  /**
   * Subscribers can use this Observable to determine if the pile they have been interested has been registered. Once the pile is registered,
   * then the subscriber can subscribe to other Observables, such as those made available in kindToLengthObservables
   */
  registeredPiles$: Observable<Set<string>> = this.registeredPilesSubject.asObservable();
  /**
   * Returns a map with a key for each registered pile and the value being an Observable emitting the length of the respective pile.
   */
  kindToLengthObservables: Map<string, Observable<number>> = new Map<string, Observable<number>>();


  constructor(private gameStateSvc: GameStateService) {
    this.initialize();
  }

  private initialize(): void {
    this.gameStateSvc.pile$.subscribe((pileStates) => {
      pileStates.forEach((pileState) => {
        const pile = this.getPile(pileState.kind);
        pile.setState(pileState);
        this.emitLength(pile);
      });
    });
  }

  private emitLength(pile: Pile): void {
    const lengthSubject = this.kindToLengthSubjects.get(pile.kind);
    if (lengthSubject) {
      lengthSubject.next(pile.length);
    } else {
      throw new Error(`Unable to find lengthSubject for pile kind ${pile.kind}`);
    }
  }

  private updateGameState(): void {
    for (const pile of this.kindToPile.values()) {
      this.gameStateSvc.setPile(pile.state);
      this.emitLength(pile);
    }
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
      this.kindToPile.set(pile.kind, pile);
      this.registeredPileKinds.add(pile.kind);
      const lengthSubject = new BehaviorSubject<number>(pile.length);
      this.kindToLengthSubjects.set(pile.kind, lengthSubject);
      this.kindToLengthObservables.set(pile.kind, lengthSubject.asObservable().pipe(distinctUntilChanged()));
      } else {
        throw new Error(`Pile for kind ${pile.kind} already registered.`);
      }
    })
    this.registeredPilesSubject.next(this.registeredPileKinds)
    this.updateGameState();
  }

  /**
   * Pulls a specified number of pieces from the pile of the given kind.
   * @param kind The kind of pile to pull pieces from.
   * @param count The number of pieces to pull. Defaults to 1.
   * @returns An array of pieces pulled from the pile, or null values if the pile is empty.
   */
  pull(kind: string, count = 1): (Piece | null)[] {
    this.gameStateSvc.requireTransaction();
    const pile = this.getPile(kind);
    const pieces = pile.pull(count);
    this.updateGameState();
    return pieces;
  }

  /**
   * Puts the specified pieces into the pile of the given kind.
   * @param kind The kind of pile to put pieces into.
   * @param pieces The pieces to put into the pile.
   */
  put(kind: string, pieces: Piece[]): void {
    this.gameStateSvc.requireTransaction();
    const pile = this.getPile(kind);
    pile.put(pieces);
    this.updateGameState();
  }
}
