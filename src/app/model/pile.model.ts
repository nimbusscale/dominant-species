import { Piece } from './piece.model';

type ItemFactory<TpieceKind extends string, Tpiece extends Piece<TpieceKind>> = (
  itemKind: TpieceKind,
) => Tpiece;

/**
 * A Pile is used to draw one or more random pieces for a defined pool of pieces.
 * A Pile has two Type Vars needed to be set when it's instantiated.
 *
 * @param TpieceKind - A type var used to set the kinds of Pieces the Pipe can contain
 * @param Tpiece - A type var used to set the type of Piece the Pile creates
 */
export class Pile<TpieceKind extends string, Tpiece extends Piece<TpieceKind>> {
  /**
   * @param itemCounts - A map that that acts as the definition for the pool of pieces the Pile represents.
   * Each map key is the kind of items included in the Pile, and the values are the count of that kind of item in
   * the pile.
   * @param itemFactory - A factory function use to build the random selected piece.
   */
  constructor(
    public itemCounts: Map<TpieceKind, number>,
    private itemFactory: ItemFactory<TpieceKind, Tpiece>,
  ) {}

  /**
   * @param count - The number of items to draw from the pile.
   * @returns - An array where each member represents the piece that was drawn. A `null`
   * will be returned for any piece drawn while the pile is empty.
   */
  pull(count = 1): (Tpiece | null)[] {
    const items: (Tpiece | null)[] = [];
    for (let i = 1; i <= count; i++) {
      const itemsWithCount = Array.from(this.itemCounts.keys()).filter((key) => {
        /** this.itemCounts.get(key) will always return a value, but TSC complains it could be unknown. */
        const itemCount = this.itemCounts.get(key) ?? 0;
        return itemCount > 0;
      });
      if (itemsWithCount.length) {
        const itemKind = itemsWithCount[Math.floor(Math.random() * itemsWithCount.length)];
        const currentCount = this.itemCounts.get(itemKind) ?? 0;
        items.push(this.itemFactory(itemKind));
        this.itemCounts.set(itemKind, currentCount - 1);
      } else {
        items.push(null);
      }
    }
    return items;
  }

  /**
   * @param items - An array of items to add to the pile.
   */
  put(items: Tpiece[]): void {
    for (const item of items) {
      const currentItemCount = this.itemCounts.get(item.kind);
      if (currentItemCount !== undefined) {
        this.itemCounts.set(item.kind, currentItemCount + 1);
      } else {
        this.itemCounts.set(item.kind, 1);
      }
    }
  }
}
