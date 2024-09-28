
export enum ElementKind {
  GRASS = 'grass',
  GRUB = 'grub',
  MEAT = 'meat',
  SEED = 'seed',
  SUN = 'sun',
  WATER = 'water'
}

export interface Element {
  kind: ElementKind
}
