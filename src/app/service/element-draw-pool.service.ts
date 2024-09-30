import { Injectable } from '@angular/core';
import {Pile} from "../model/pile.model";
import {Element, ElementKind} from "../model/element.model";

@Injectable({
  providedIn: 'root'
})
export class ElementDrawPoolService {
  private elementPile: Pile<ElementKind, Element> | undefined = undefined
  constructor() {
    this.initialize()
  }

  private elementFactory = (elementKind: ElementKind): Element => {
    return {kind: elementKind};
  };

  private get drawPool(): Pile<ElementKind, Element> {
    if (!this.elementPile) {
      throw new Error("Element pile has not been initialized.");
    }
    return this.elementPile;
  }

  /** for not we are initializing the data in the service, but this will be done by the game state service in the future. */
  initialize() {
    // 20 Elements each, with 2 being places on Earth, leaving 18 in the bag
    const config = new Map<ElementKind, number> ([
      ['grass', 18],
      ['grub', 18],
      ['meat', 18],
      ['seed', 18],
      ['sun', 18],
      ['water', 18],
    ])
    this.elementPile = new Pile<ElementKind, Element>(config, this.elementFactory)
  }

  get length(): number {
    return this.drawPool.length
  }

  pull(count = 1): (Element | null)[] {
    return this.drawPool.pull(count)
  }

  put(elements: Element[]): void {
    this.drawPool.put(elements)
  }
}
