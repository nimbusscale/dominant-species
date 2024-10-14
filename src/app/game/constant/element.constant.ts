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
  ['grass', 'dominant-species/element/noun-grass-7195612.svg'],
  ['grub', 'dominant-species/element/noun-grub-3386143.svg'],
  ['meat', 'dominant-species/element/noun-cow-skull-151117.svg'],
  ['seed', 'dominant-species/element/noun-seed-6850047.svg'],
  ['sun', 'dominant-species/element/noun-sun-7300296.svg'],
  ['water', 'dominant-species/element/noun-water-water-1235535.svg'],

])
