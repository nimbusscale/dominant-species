import { Injectable } from '@angular/core';
import { Pile, PileState } from '../model/pile.model';
import { Element, ElementKind } from '../model/element.model';

@Injectable({
  providedIn: 'root',
})
export class ElementDrawPoolService {
  private elementPile: Pile<ElementKind, Element> | undefined = undefined;
  constructor() {
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

  /** for now we are initializing the data in the service, but this will be done by the game state service in the future. */
  initialize() {
    // 20 Elements each, with 2 being places on Earth, leaving 18 in the bag
    const state: PileState<ElementKind> = {
      grassElement: 18,
      grubElement: 18,
      meatElement: 18,
      seedElement: 18,
      sunElement: 18,
      waterElement: 18,
    };
    this.elementPile = new Pile<ElementKind, Element>(state, this.elementFactory);
  }

  get length(): number {
    return this.drawPool.length;
  }

  pull(count = 1): (Element | null)[] {
    return this.drawPool.pull(count);
  }

  put(elements: Element[]): void {
    this.drawPool.put(elements);
  }
}
