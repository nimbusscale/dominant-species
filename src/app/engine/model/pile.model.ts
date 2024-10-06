import { Piece } from './piece.model';
import { GameStateElement } from './game-state.model';
import { BehaviorSubject, Observable } from 'rxjs';

type ItemFactory<TpieceKind extends string, Tpiece extends Piece<TpieceKind>> = (
  itemKind: TpieceKind,
) => Tpiece;

/**
 * PileState is pretty simple as it just keeps tracks of what kinds of pieces are in the pile and how many of them.
 */
export type PileState<TpieceKind extends string> = GameStateElement & {
  inventory: {
    [K in TpieceKind]?: number;
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
export class Pile<TpieceKind extends string, Tpiece extends Piece<TpieceKind>> {
  private readonly itemFactory: ItemFactory<TpieceKind, Tpiece>;
  private lengthSubject = new BehaviorSubject<number>(0);
  private _state: PileState<TpieceKind>;
  readonly length$: Observable<number> = this.lengthSubject.asObservable();

  /**
   * @param state An object that acts as the definition for the pool of pieces the Pile represents.
   * Each key is the kind of items included in the Pile, and the values are the count of that kind of item in
   * the pile.
   * @param itemFactory A factory function use to build the random selected piece.
   */
  constructor(state: PileState<TpieceKind>, itemFactory: ItemFactory<TpieceKind, Tpiece>) {
    this._state = state;
    this.itemFactory = itemFactory;
    this.emitLength();
  }

  /**
   * Returns the total number of items in the pile.
   */
  get length(): number {
    return Object.keys(this._state.inventory).reduce(
      (sum, key) => sum + (this._state.inventory[key as TpieceKind] ?? 0),
      0,
    );
  }

  private emitLength() {
    this.lengthSubject.next(this.length);
  }

  get state(): PileState<TpieceKind> {
    return this._state;
  }

  setState(newState: PileState<TpieceKind>) {
    this._state = newState;
    this.emitLength();
  }

  /**
   * @param count The number of items to draw from the pile.
   * @returns An array where each member represents the piece that was drawn. A `null`
   * will be returned for any piece drawn while the pile is empty.
   */
  pull(count = 1): (Tpiece | null)[] {
    const items: (Tpiece | null)[] = [];
    for (let i = 0; i < count; i++) {
      const itemsWithCount = Object.keys(this._state.inventory).filter((key) => {
        /** this.itemCounts.get(key) will always return a value, but TSC complains it could be unknown. */
        const itemCount = this._state.inventory[key as TpieceKind] ?? 0;
        return itemCount > 0;
      }) as TpieceKind[];

      if (itemsWithCount.length) {
        const itemKind = itemsWithCount[Math.floor(Math.random() * itemsWithCount.length)];
        const currentCount = this._state.inventory[itemKind] ?? 0;
        items.push(this.itemFactory(itemKind));
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
  put(items: Tpiece[]): void {
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
