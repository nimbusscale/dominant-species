import {Piece, PieceFactory} from './piece.model';
import {GameStateElement} from './game-state.model';
import {BehaviorSubject, Observable} from 'rxjs';

/**
 * PileState is pretty simple as it just keeps tracks of what kinds of pieces are in the pile and how many of them.
 */
export type PileState = GameStateElement & {
  inventory: {
    [key: string]: number;
  };
};

/**
 * A Pile is used to draw one or more random pieces for a defined pool of pieces.
 * A Pile has two Type Vars needed to be set when it's instantiated:
 *
 * **Tpiece** Kind A type var used to set the kinds of Pieces the Pipe can contain and
 *
 * **Tpiece** A type var used to set the type of Piece the Pile creates
 *
 */
export class Pile {
  private readonly pieceFactory: PieceFactory;
  private lengthSubject = new BehaviorSubject<number>(0);
  private _state: PileState;
  readonly length$: Observable<number> = this.lengthSubject.asObservable();

  /**
   * @param state An object that acts as the definition for the pool of pieces the Pile represents.
   * Each key is the kind of items included in the Pile, and the values are the count of that kind of item in
   * the pile.
   * @param itemFactory A factory function use to build the random selected piece.
   */
  constructor(state: PileState, itemFactory: PieceFactory) {
    this._state = state;
    this.pieceFactory = itemFactory;
    this.emitLength();
  }

  /**
   * Returns the total number of items in the pile.
   */
  get length(): number {
    return Object.keys(this._state.inventory).reduce(
      (sum, key) => sum + (this._state.inventory[key] ?? 0),
      0,
    );
  }

  private emitLength() {
    this.lengthSubject.next(this.length);
  }

  get state(): PileState {
    return this._state;
  }

  setState(newState: PileState) {
    this._state = newState;
    this.emitLength();
  }

  /**
   * @param count The number of items to draw from the pile.
   * @returns An array where each member represents the piece that was drawn. A `null`
   * will be returned for any piece drawn while the pile is empty.
   */
  pull(count = 1): (Piece | null)[] {
    const items: (Piece | null)[] = [];
    for (let i = 0; i < count; i++) {
      const itemsWithCount = Object.keys(this._state.inventory).filter((key) => {
        /** this.itemCounts.get(key) will always return a value, but TSC complains it could be unknown. */
        const itemCount = this._state.inventory[key] ?? 0;
        return itemCount > 0;
      }) as string[];

      if (itemsWithCount.length) {
        const itemKind = itemsWithCount[Math.floor(Math.random() * itemsWithCount.length)];
        const currentCount = this._state.inventory[itemKind] ?? 0;
        items.push(this.pieceFactory(itemKind));
        this._state.inventory[itemKind] = currentCount - 1;
      } else {
        items.push(null);
      }
    }
    this.emitLength();
    return items;
  }

  /**
   * @param items An array of items to add to the pile.
   */
  put(items: Piece[]): void {
    for (const item of items) {
      const currentItemCount = this._state.inventory[item.kind];
      if (currentItemCount !== undefined) {
        this._state.inventory[item.kind] = currentItemCount + 1;
      } else {
        this._state.inventory[item.kind] = 1;
      }
    }
    this.emitLength();
  }
}
