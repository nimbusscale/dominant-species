import { Injectable } from '@angular/core';
import { GameElement, GameElementState } from '../model/game-state.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pile } from '../model/pile.model';
import {
  AreaStateService,
  FactionStateService,
  GameElementStateService,
  PileStateService,
} from './game-element-state.service';
import { Area } from '../model/area.model';
import { Faction } from '../model/faction.model';

@Injectable({
  providedIn: 'root',
})
export abstract class GameElementRegistryService<
  TgameElement extends GameElement,
  TgameElementStateSvc extends GameElementStateService<GameElementState, TgameElement>,
> {
  private registeredIds: Set<string> = new Set<string>();
  private elementById: Map<string, TgameElement> = new Map<string, TgameElement>();
  private registeredElementSubject = new BehaviorSubject<Set<string>>(new Set());
  registeredIds$: Observable<Set<string>> = this.registeredElementSubject.asObservable();

  constructor(protected gameElementStateSvc: TgameElementStateSvc) {}

  get(id: string): TgameElement {
    const element = this.elementById.get(id);
    if (!element) {
      throw new Error(`Element with id ${id} is not registered.`);
    } else {
      return element;
    }
  }
  register(elements: TgameElement[]): void {
    elements.forEach((element) => {
      if (!this.registeredIds.has(element.id)) {
        this.elementById.set(element.id, element);
        this.registeredIds.add(element.id);
      } else {
        throw new Error(`Element with id ${element.id} already registered.`);
      }
    });
    this.registeredElementSubject.next(this.registeredIds);
    this.gameElementStateSvc.register(elements);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AreaRegistryService extends GameElementRegistryService<Area, AreaStateService> {
  constructor(protected areaStateSvc: AreaStateService) {
    super(areaStateSvc);
  }
}

@Injectable({
  providedIn: 'root',
})
export class FactionRegistryService extends GameElementRegistryService<
  Faction,
  FactionStateService
> {
  constructor(protected factionStateSvc: FactionStateService) {
    super(factionStateSvc);
  }
}

@Injectable({
  providedIn: 'root',
})
export class PileRegistryService extends GameElementRegistryService<Pile, PileStateService> {
  constructor(protected pileStateSvc: PileStateService) {
    super(pileStateSvc);
  }
}
