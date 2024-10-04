import { Injectable } from '@angular/core';
import { Pile } from '../../engine/model/pile.model';
import { Element, ElementKind } from '../model/element.model';
import { DrawPileKind } from '../dominant-species.constants';
import { GameStateService } from '../../engine/service/game-state.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElementDrawPoolService {
  private elementPile: Pile<ElementKind, Element> | undefined = undefined;
  constructor(private gameStateSvc: GameStateService) {
    this.initialize();
  }

  private elementFactory = (elementKind: ElementKind): Element => {
    return { kind: elementKind };
  };

  private get drawPool(): Pile<ElementKind, Element> {
    if (!this.elementPile) {
      throw new Error('Element pile has not been initialized.');
    }
    return this.elementPile;
  }

  private initialize() {
    this.gameStateSvc.pile$
      .pipe(
        map((pileStates) =>
          pileStates.find((pileState) => pileState.kind === (DrawPileKind.ELEMENT as string)),
        ),
      )
      .subscribe((drawPileState) => {
        if (drawPileState) {
          this.elementPile = new Pile<ElementKind, Element>(drawPileState, this.elementFactory);
        } else {
          throw new Error('GameState does not include a state element for the ElementDrawPool');
        }
      });
  }

  get length(): number {
    return this.drawPool.length;
  }

  get length$(): Observable<number> {
    return this.drawPool.length$;
  }

  private updateGameState(): void {
    if (this.elementPile) {
      this.gameStateSvc.setPile(this.elementPile.state);
    } else {
      throw new Error("elementPile doesn't have state!");
    }
  }

  pull(count = 1): (Element | null)[] {
    const items = this.drawPool.pull(count);
    this.updateGameState();
    return items;
  }

  put(elements: Element[]): void {
    this.drawPool.put(elements);
    this.updateGameState();
  }
}
