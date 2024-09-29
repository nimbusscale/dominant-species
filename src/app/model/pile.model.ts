import {Piece} from "./piece.model";

interface ItemFactory<K extends string, T extends Piece<K>> {
  (itemKind: K): T;
}

export class Pile<K extends string, T extends Piece<K>> {
  constructor(
    public itemCounts: Map<K, number>, // The key is now of type K (string literal type)
    private itemFactory: ItemFactory<K, T> // The factory is generic over K and T
  ) {}

  pull(count: number = 1 ): T[] {
    const itemsWithCount =  Array.from(this.itemCounts.keys()).filter((key) => {
      const itemCount = this.itemCounts.get(key)!
      return itemCount > 0
      })

    const items: T[] = []
    if (itemsWithCount.length) {
      for (let i = 1; i <= count; i++) {
        const itemKind = itemsWithCount[Math.floor(Math.random() * itemsWithCount.length)]
        items.push(this.itemFactory(itemKind))
      }
    }
    return items
  }

  put(items: T[]): void {
    for (let item of items) {
      const currentItemCount = this.itemCounts.get(item.kind)
      if (currentItemCount !== undefined) {
        this.itemCounts.set(item.kind, currentItemCount + 1)
      } else {
        this.itemCounts.set(item.kind, 1)
      }
    }
  }
}
