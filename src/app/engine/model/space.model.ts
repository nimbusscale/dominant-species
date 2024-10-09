import { Action } from './action.model';
import { Piece } from './piece.model';
import { deepClone } from 'fast-json-patch';
import { Observable, Subject } from 'rxjs';

export interface SpaceState {
  kind: string;
  piece: Piece | null;
}

export class Space {
  readonly kind: string;
  private _action: Action[] = [];
  private _piece: Piece | null = null;
  private stateSubject: Subject<SpaceState>;
  state$: Observable<SpaceState>;

  constructor(kind: string) {
    this.kind = kind;
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
    this._piece = piece;
    this.stateSubject.next(this.state);
  }

  removePiece(): void {
    this._piece = null;
    this.stateSubject.next(this.state);
  }

  setState(newState: SpaceState) {
    if (newState.kind == this.kind) {
      this._piece = newState.piece;
    } else {
      throw new Error('State does not match space kind');
    }
  }
}
