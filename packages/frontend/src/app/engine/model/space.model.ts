import { deepClone } from 'fast-json-patch';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { Piece, SpaceState } from 'api-types/src/game-state';
import {Action} from "./action.model";

/**
 * A Space is part of an Area and can either be empty or contain a Piece.
 *
 * A space can have zero or more actions associated with it. Actions are not part of the Space's state, so when an action is added/removed,
 * interested parties need to be notified. Notifications also need to happen when the state is updated, so a GSP can be created, etc.
 * This leads to having two observables:
 * - state$ for when anything state relates, such as the space's piece
 * - space$ for when anything about the space changes, even if the change is not state related such as adding/removing action.
 */
export class Space {
  readonly kind: string;
  private _actions: Action[] = [];
  private _piece: Piece | null = null;
  private spaceSubject: BehaviorSubject<Space>
  space$: Observable<Space>
  private stateSubject= new Subject<SpaceState>
  state$= this.stateSubject.asObservable()

  constructor(state: SpaceState) {
    this.kind = state.kind;
    this._piece = state.piece;
    this.spaceSubject= new BehaviorSubject<Space>(this)
    this.space$ = this.spaceSubject.asObservable()
  }

  get state(): SpaceState {
    return deepClone({
      kind: this.kind,
      piece: this._piece,
    }) as SpaceState;
  }

  private notifyChange(stateChange: boolean): void {
    this.spaceSubject.next(this);
    if (stateChange) {
      this.stateSubject.next(this.state)
    }
  }

  setActions(actions: Action[]): void {
    this._actions = actions
    this.notifyChange(false)
  }

  clearActions(): void {
    this._actions = []
    this.notifyChange(false)
  }

  get actions(): Action[] {
    return this._actions;
  }

  get piece(): Piece | null {
    return this._piece;
  }

  addPiece(piece: Piece): void {
    if (!this._piece) {
      this._piece = piece;
      this.notifyChange(true)
    } else {
      throw new Error('space already has a piece');
    }
  }

  removePiece(): Piece {
    if (this._piece) {
      const removedPiece = this._piece;
      this._piece = null;
      this.notifyChange(true)
      return removedPiece;
    } else {
      throw new Error('no piece to remove from space');
    }
  }

  setState(newState: SpaceState) {
    if (newState.kind == this.kind) {
      this._piece = newState.piece;
      this.notifyChange(false)
    } else {
      throw new Error('State does not match space kind');
    }
  }
}
