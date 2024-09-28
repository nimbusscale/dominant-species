import {Piece} from "./piece.model";

interface ItemFactory {
  (itemKind: any): Piece
}

export class Pile<T extends Piece> {
  constructor(
        public itemCounts: Map<object, number>,
        private itemFactory: ItemFactory
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
        items.push(this.itemFactory(itemKind) as T)
      }
    }
    return items
  }

  put(items: T[]): void {
    for (let item of items) {
      const currentItemCount = this.itemCounts.get(item.kind)
      if (currentItemCount) {
        this.itemCounts.set(item.kind, currentItemCount + 1)
      } else {
        this.itemCounts.set(item.kind, 1)
      }
    }
  }
}
