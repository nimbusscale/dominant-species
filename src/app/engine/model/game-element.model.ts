import {GameElementState} from "./game-state.model";
import {BehaviorSubject, Observable} from "rxjs";
import {deepClone} from "fast-json-patch";

export class GameElement<T extends GameElementState> {
  protected _state: T;
  private stateSubject: BehaviorSubject<T>;
  state$: Observable<T>;

  constructor(state: T) {
    this._state = state;
    this.stateSubject = new BehaviorSubject<T>(this.state);
    this.state$ = this.stateSubject.asObservable();
  }

  get id(): string {
    return this._state.id
  }

  get state(): T {
    return deepClone(this._state) as T;
  }

  setState(newState: T) {
    this._state = newState;
  }

  protected emitState(): void {
    this.stateSubject.next(this.state);
  }
}
