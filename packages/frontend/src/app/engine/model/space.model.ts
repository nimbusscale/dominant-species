import { Action } from './action.model';
import { deepClone } from 'fast-json-patch';
import { Observable, Subject } from 'rxjs';
import { Piece, SpaceState } from 'api-types/src/game-state';

export class Space {
  readonly kind: string;
  private _action: Action[] = [];
  private _piece: Piece | null = null;
  private stateSubject: Subject<SpaceState>;
  state$: Observable<SpaceState>;

  constructor(state: SpaceState) {
    this.kind = state.kind;
    this._piece = state.piece
    this.stateSubject = new Subject<SpaceState>();
    this.state$ = this.stateSubject.asObservable();
  }

  get state(): SpaceState {
    return deepClone({
      kind: this.kind,
      piece: this._piece,
    }) as SpaceState;
  }

  get action(): Action[] {
    return this._action;
  }

  get piece(): Piece | null {
    return this._piece;
  }

  addPiece(piece: Piece): void {
    if (!this._piece) {
      this._piece = piece;
      this.stateSubject.next(this.state);
    } else {
      throw new Error('space already has a piece');
    }
  }

  removePiece(): Piece {
    if (this._piece) {
      const removedPiece = this._piece;
      this._piece = null;
      this.stateSubject.next(this.state);
      return removedPiece;
    } else {
      throw new Error('no piece to remove from space');
    }
  }

  setState(newState: SpaceState) {
    if (newState.kind == this.kind) {
      this._piece = newState.piece;
    } else {
      throw new Error('State does not match space kind');
    }
  }
}
