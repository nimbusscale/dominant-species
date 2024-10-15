import { AnimalEnum } from './animal.constant';

export enum AreaIdEnum {
  ACTION_DISPLAY_ABUNDANCE = 'actionDisplayAbundance',
  ACTION_DISPLAY_ADAPTION = 'actionDisplayAdaption',
  AMPHIBIAN_ELEMENT = 'amphibianElement',
  ARACHNID_ELEMENT = 'arachnidElement',
  BIRD_ELEMENT = 'birdElement',
  INSECT_ELEMENT = 'insectElement',
  MAMMAL_ELEMENT = 'mammalElement',
  REPTILE_ELEMENT = 'reptileElement',
}

export type AreaId = `${AreaIdEnum}`;

export const elementAreaIdsByAnimal: ReadonlyMap<string, string> = new Map<string, string>([
  [AnimalEnum.AMPHIBIAN, AreaIdEnum.AMPHIBIAN_ELEMENT],
  [AnimalEnum.ARACHNID, AreaIdEnum.ARACHNID_ELEMENT],
  [AnimalEnum.BIRD, AreaIdEnum.BIRD_ELEMENT],
  [AnimalEnum.INSECT, AreaIdEnum.INSECT_ELEMENT],
  [AnimalEnum.MAMMAL, AreaIdEnum.MAMMAL_ELEMENT],
  [AnimalEnum.REPTILE, AreaIdEnum.REPTILE_ELEMENT],
]);

export enum SpaceKindEnum {
  ACTION_PAWN = 'actionPawn',
  ELEMENT = 'element',
}
