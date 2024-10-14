export enum ElementEnum {
  GRASS = 'grass',
  GRUB = 'grub',
  MEAT = 'meat',
  SEED = 'seed',
  SUN = 'sun',
  WATER = 'water',
}

export type ElementKind = `${ElementEnum}`;

export const elementImgPathByElementKind: ReadonlyMap<string, string> = new Map<string, string>([
  ['grass', 'dominant-species/element/noun-grass-7195612.svg']
])
