import {BehaviorSubject, Observable} from 'rxjs';
import {deepClone} from 'fast-json-patch';
import {GameElementState} from "api-types/src/game-state";

export class GameElement<T extends GameElementState> {
  protected _state: T;
  protected stateSubject: BehaviorSubject<T>;
  state$: Observable<T>;

  constructor(state: T) {
    this._state = state;
    this.stateSubject = new BehaviorSubject<T>(this.state);
    this.state$ = this.stateSubject.asObservable();
  }

  get id(): string {
    return this._state.id;
  }

  get state(): T {
    return deepClone(this._state) as T;
  }

  /**
   * Set state happens when a GSP is received, so state is not emitted back as it's already in the GameState
   * @param newState
   */
  setState(newState: T) {
    if (newState.id === this.id) {
      this._state = newState;
    } else {
      throw new Error("new id doesn't match existing it");
    }
  }

  protected emitState(): void {
    this.stateSubject.next(this.state);
  }
}
