import { Injectable } from '@angular/core';
import { GameStateService } from '../game-state/game-state.service';
import { Observable, skip } from 'rxjs';
import { GameElement } from '../../model/game-element.model';
import { getOrThrow } from '../../util/misc';
import { GameElementState } from 'api-types/src/game-state';

/**
 * Abstract base class that manages the synchronization between individual
 * `GameElement` instances and the central `GameStateService`.
 *
 * This service handles:
 * - Registration of `GameElement` instances.
 * - Listening to state changes in individual `GameElement` instances and updating the central game state.
 * - Subscribing to changes in the central game state and updating the corresponding `GameElement` instances.
 *
 * Subclasses must implement methods to interact with specific types of `GameElement`
 * and their corresponding states.
 *
 * @typeParam TgameElementState - The specific type of `GameElementState` managed by the subclass.
 * @typeParam TgameElement - The specific type of `GameElement` managed by the subclass.
 */
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

  /**
   * Observable that emits arrays of `GameElementState` from the central `GameStateService`.
   *
   * Subclasses must provide an observable that emits the relevant `GameElementState`
   * instances for their specific type of `GameElement`.
   */
  protected abstract get elementState$(): Observable<TgameElementState[]>;

  /**
   * Registers the state of a `GameElement` with the central `GameStateService`.
   *
   * Subclasses must implement this method to add the `GameElement`'s state
   * to the central game state.
   *
   * @param element - The `GameElement` to register.
   */
  protected abstract registerEntityState(element: TgameElement): void;

  /**
   * Updates the state of a `GameElement` in the central `GameStateService`.
   *
   * Subclasses must implement this method to update the state of a `GameElement`
   * in the central game state when its state changes.
   *
   * @param state - The new state of the `GameElement`.
   */
  protected abstract setEntityState(state: GameElementState): void;

  /**
   * Initializes the service by subscribing to the central `GameStateService`'s observable
   * of `GameElementState`. When the state of a registered `GameElement` changes in the
   * central game state, this method updates the corresponding `GameElement`.
   */
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

  /**
   * Retrieves a registered `GameElement` by its ID.
   *
   * @param id - The ID of the `GameElement` to retrieve.
   * @returns The `GameElement` associated with the given ID.
   * @throws If no `GameElement` with the given ID is registered.
   */
  private getEntity(id: string): TgameElement {
    return getOrThrow(this.elementById, id);
  }

  /**
   * Registers one or more `GameElement` instances with the service.
   *
   * This method:
   * - Adds the `GameElement` instances to the internal registry.
   * - Registers their state with the central `GameStateService`.
   * - Subscribes to their state changes to update the central game state.
   *
   * @param entities - The `GameElement` instances to register.
   * @throws If a `GameElement` with the same ID is already registered.
   */
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
