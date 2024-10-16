import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameElementStateService } from './game-element-state.service';
import { GameElement, GameElementState } from '../../model/game-element.model';
import { getOrThrow } from '../../util/misc';

@Injectable({
  providedIn: 'root',
})
export abstract class GameElementRegistryService<
  TgameElementState extends GameElementState,
  TgameElement extends GameElement<TgameElementState>,
  TgameElementStateSvc extends GameElementStateService<TgameElementState, TgameElement>,
> {
  private registeredIds: Set<string> = new Set<string>();
  private elementById: Map<string, TgameElement> = new Map<string, TgameElement>();
  private registeredElementSubject = new BehaviorSubject<Set<string>>(new Set());
  registeredIds$: Observable<Set<string>> = this.registeredElementSubject.asObservable();

  constructor(protected gameElementStateSvc: TgameElementStateSvc) {}

  get(id: string): TgameElement {
    return getOrThrow(this.elementById, id);
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
