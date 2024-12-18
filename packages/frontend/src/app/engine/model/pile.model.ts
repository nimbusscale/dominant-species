import { defaultPieceFactory, PieceFactory } from './piece.model';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { GameElement } from './game-element.model';
import { Piece, PileState } from 'api-types/src/game-state';

/**
 * A Pile is used to draw one or more random pieces for a defined pool of pieces.
 */
export class Pile extends GameElement<PileState> {
  private readonly owner: string | null;
  private readonly pieceFactory: PieceFactory;
  private lengthSubject: BehaviorSubject<number>;
  length$: Observable<number>;

  /**
   * @param state An object that acts as the definition for the pool of pieces the Pile represents.
   * Each key is the kind of pieces included in the Pile, and the values are the count of that kind of piece in
   * the pile.
   * @param pieceFactory A factory function use to build the random selected piece.
   */
  constructor(state: PileState, pieceFactory: PieceFactory = defaultPieceFactory) {
    super(state);
    this.owner = state.owner;
    this.pieceFactory = pieceFactory;
    this.lengthSubject = new BehaviorSubject<number>(this.length);
    this.length$ = this.lengthSubject.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Returns the total number of pieces in the pile.
   */
  get length(): number {
    return Object.keys(this._state.inventory).reduce(
      (sum, key) => sum + (this._state.inventory[key] ?? 0),
      0,
    );
  }

  override setState(newState: PileState) {
    super.setState(newState);
    this.emitLength();
  }

  private emitLength(): void {
    this.lengthSubject.next(this.length);
  }

  private emitPileState(): void {
    this.emitState();
    this.emitLength();
  }

  /**
   * Pulls a specified number of pieces from the pile of the given kind.
   * @param count The number of pieces to pull. Defaults to 1.
   * @returns An array of pieces pulled from the pile, or null values if the pile is empty.
   */
  pullMany(count = 1): (Piece | null)[] {
    const pieces: (Piece | null)[] = [];
    for (let i = 0; i < count; i++) {
      const piecesWithCount = Object.keys(this._state.inventory).filter((key) => {
        /** this.pieceCounts.get(key) will always return a value, but TSC complains it could be unknown. */
        const pieceCount = this._state.inventory[key] ?? 0;
        return pieceCount > 0;
      });

      if (piecesWithCount.length) {
        const kind = piecesWithCount[Math.floor(Math.random() * piecesWithCount.length)];
        const currentCount = this._state.inventory[kind] ?? 0;
        pieces.push(this.pieceFactory(kind, this.owner));
        this._state.inventory[kind] = currentCount - 1;
      } else {
        pieces.push(null);
      }
    }
    this.emitPileState();
    return pieces;
  }

  pullOne(): Piece | null {
    return this.pullMany(1)[0];
  }

  /**
   * Puts the specified pieces into the pile of the given kind.
   * @param pieces The pieces to put into the pile.
   */
  put(pieces: Piece[]): void {
    for (const piece of pieces) {
      // Assume the current count is 0 if the piece is not yet in the inventory
      const currentItemCount = this._state.inventory[piece.kind] || 0;
      this._state.inventory[piece.kind] = currentItemCount + 1;
    }
    this.emitPileState();
  }
}

export class PileAdapter<T> {
  constructor(private pile: Pile) {}

  get length(): number {
    return this.pile.length;
  }

  get length$(): Observable<number> {
    return this.pile.length$;
  }

  pullMany(count = 1): (T | null)[] {
    return this.pile.pullMany(count) as T[];
  }

  pullOne(): T | null {
    return this.pile.pullOne() as T;
  }

  put(pieces: T[]): void {
    this.pile.put(pieces as Piece[]);
  }
}
