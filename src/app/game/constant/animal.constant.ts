export enum AnimalEnum {
  AMPHIBIAN = 'amphibian',
  ARACHNID = 'arachnid',
  BIRD = 'bird',
  INSECT = 'insect',
  MAMMAL = 'mammal',
  REPTILE = 'reptile',
}

export type AnimalKind = `${AnimalEnum}`;
