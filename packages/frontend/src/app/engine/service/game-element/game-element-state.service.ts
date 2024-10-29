import { Injectable } from '@angular/core';
import { GameStateService } from '../game-state/game-state.service';
import { Observable, skip } from 'rxjs';
import { GameElement } from '../../model/game-element.model';
import { getOrThrow } from '../../util/misc';
import { GameElementState } from 'api-types/src/game-state';

@Injectable({
  providedIn: 'root',
})
export abstract class GameElementStateService<
  TgameElementState extends GameElementState,
  TgameElement extends GameElement<TgameElementState>,
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
    return getOrThrow(this.elementById, id);
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
