import {defaultPieceFactory, Piece, PieceFactory} from './piece.model';
import {GameStateElement} from './game-state.model';
import {deepClone} from "fast-json-patch";

/**
 * PileState is pretty simple as it just keeps tracks of what kinds of pieces are in the pile and how many of them.
 */
export interface PileState extends GameStateElement {
  inventory: Record<string, number>;
}


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
  private _state: PileState;


  /**
   * @param state An object that acts as the definition for the pool of pieces the Pile represents.
   * Each key is the kind of pieces included in the Pile, and the values are the count of that kind of piece in
   * the pile.
   * @param pieceFactory A factory function use to build the random selected piece.
   */
  constructor(state: PileState, pieceFactory: PieceFactory = defaultPieceFactory) {
    this._state = state;
    this.pieceFactory = pieceFactory;
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

  get state(): PileState {
    return deepClone(this._state) as PileState;
  }

  get kind(): string {
    return this._state.kind
  }

  setState(newState: PileState) {
    this._state = newState;
  }

  /**
   * @param count The number of pieces to draw from the pile.
   * @returns An array where each member represents the piece that was drawn. A `null`
   * will be returned for any piece drawn while the pile is empty.
   */
  pull(count = 1): (Piece | null)[] {
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
        pieces.push(this.pieceFactory(kind));
        this._state.inventory[kind] = currentCount - 1;
      } else {
        pieces.push(null);
      }
    }
    return pieces;
  }

  /**
   * @param pieces An array of pieces to add to the pile.
   */
  put(pieces: Piece[]): void {
    for (const piece of pieces) {
      // Assume the current count is 0 if the piece is not yet in the inventory
      const currentItemCount = this._state.inventory[piece.kind] || 0;
      this._state.inventory[piece.kind] = currentItemCount + 1;
    }
  }
}
