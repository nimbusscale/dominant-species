import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Observable, skip } from 'rxjs';
import { Area, AreaState } from '../model/area.model';
import { Pile, PileState } from '../model/pile.model';
import { GameElement, GameElementState } from '../model/game-state.model';

@Injectable({
  providedIn: 'root',
})
export abstract class GameElementStateService<
  TgameElementState extends GameElementState,
  TgameElement extends GameElement,
> {
  private registeredIds: Set<string> = new Set<string>();
  private elementById: Map<string, TgameElement> = new Map<string, TgameElement>();

  constructor(protected gameStateSvc: GameStateService) {
    this.initialize();
  }

  protected abstract get elementState$(): Observable<TgameElementState[]>;
  protected abstract registerEntityState(element: TgameElement): void;
  protected abstract setEntityState(state: GameElementState): void;

  private initialize(): void {
    this.elementState$.subscribe((entities) => {
      entities.forEach((elementState) => {
        if (this.registeredIds.has(elementState.id)) {
          const element: TgameElement = this.getEntity(elementState.id);
          element.setState(elementState);
        }
      });
    });
  }

  private getEntity(id: string): TgameElement {
    const element = this.elementById.get(id);
    if (!element) {
      throw new Error(`Entity for id ${id} is not registered.`);
    }
    return element;
  }

  register(entities: TgameElement[]): void {
    entities.forEach((element) => {
      if (!this.registeredIds.has(element.id)) {
        this.registeredIds.add(element.id);
        this.elementById.set(element.id, element);
        this.registerEntityState(element);
        element.state$.pipe(skip(1)).subscribe((state) => {
          this.setEntityState(state);
        });
      } else {
        throw new Error(`Entity for id ${element.id} already registered.`);
      }
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class AreaStateService extends GameElementStateService<AreaState, Area> {
  protected get elementState$() {
    return this.gameStateSvc.area$;
  }

  protected registerEntityState(area: Area) {
    this.gameStateSvc.registerArea(area.state);
  }

  protected setEntityState(state: AreaState) {
    this.gameStateSvc.setArea(state);
  }
}

@Injectable({
  providedIn: 'root',
})
export class PileStateService extends GameElementStateService<PileState, Pile> {
  protected get elementState$() {
    return this.gameStateSvc.pile$;
  }

  protected registerEntityState(pile: Pile) {
    this.gameStateSvc.registerPile(pile.state);
  }

  protected setEntityState(state: PileState) {
    this.gameStateSvc.setPile(state);
  }
}
