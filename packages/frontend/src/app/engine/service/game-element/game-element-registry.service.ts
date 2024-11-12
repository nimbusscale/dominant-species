import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameElementStateService } from './game-element-state.service';
import { GameElement } from '../../model/game-element.model';
import { getOrThrow } from '../../util/misc';
import { GameElementState } from 'api-types/src/game-state';

/**
 * Abstract base class that manages the registration and retrieval
 * of `GameElement` instances.
 *
 * This service:
 * - Keeps track of registered `GameElement` instances.
 * - Provides methods to retrieve them by ID.
 * - Notifies observers when the set of registered IDs changes.
 *
 * It depends on a `GameElementStateService` to handle synchronization
 * of `GameElement` states with the central `GameStateService`.
 *
 * Subclasses should provide specific implementations for different
 * types of `GameElement`.
 *
 * @typeParam TgameElementState - The specific type of `GameElementState` managed by the subclass.
 * @typeParam TgameElement - The specific type of `GameElement` managed by the subclass.
 * @typeParam TgameElementStateSvc - The specific `GameElementStateService` used for state synchronization.
 */
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

  protected constructor(protected gameElementStateSvc: TgameElementStateSvc) {}

  /**
   * Retrieves a registered `GameElement` by its ID.
   *
   * @param id - The ID of the `GameElement` to retrieve.
   * @returns The `GameElement` associated with the given ID.
   * @throws If no `GameElement` with the given ID is registered.
   */
  get(id: string): TgameElement {
    return getOrThrow(this.elementById, id);
  }

  /**
   * Registers one or more `GameElement` instances with the service.
   *
   * This method:
   * - Adds the `GameElement` instances to the internal registry.
   * - Emits the updated set of registered IDs.
   * - Registers the elements with the `GameElementStateService` for state synchronization.
   *
   * @param elements - The `GameElement` or array of `GameElement` instances to register.
   * @throws If a `GameElement` with the same ID is already registered.
   */
  register(elements: TgameElement | TgameElement[]): void {
    const elementsArray = Array.isArray(elements) ? elements : [elements];

    elementsArray.forEach((element) => {
      if (!this.registeredIds.has(element.id)) {
        this.elementById.set(element.id, element);
        this.registeredIds.add(element.id);
      } else {
        throw new Error(`Element with id ${element.id} already registered.`);
      }
    });

    this.registeredElementSubject.next(this.registeredIds);
    this.gameElementStateSvc.register(elementsArray);
  }
}
