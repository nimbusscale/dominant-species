import { ElementEnum, ElementKind } from './element.constant';
import { AreaId, AreaIdEnum } from './area.constant';
import { AnimalEnum } from './animal.constant';

export interface ElementConfig {
  kind: ElementKind;
  inherentCount: number;
  areaId: AreaId;
}

export const elementConfigByAnimal: ReadonlyMap<AnimalEnum, ElementConfig> = new Map<
  AnimalEnum,
  ElementConfig
>([
  [
    AnimalEnum.AMPHIBIAN,
    { kind: ElementEnum.WATER, inherentCount: 3, areaId: AreaIdEnum.AMPHIBIAN_ELEMENT },
  ],
  [
    AnimalEnum.ARACHNID,
    { kind: ElementEnum.GRUB, inherentCount: 2, areaId: AreaIdEnum.ARACHNID_ELEMENT },
  ],
  [AnimalEnum.BIRD, { kind: ElementEnum.SEED, inherentCount: 2, areaId: AreaIdEnum.BIRD_ELEMENT }],
  [
    AnimalEnum.INSECT,
    { kind: ElementEnum.GRASS, inherentCount: 2, areaId: AreaIdEnum.INSECT_ELEMENT },
  ],
  [
    AnimalEnum.MAMMAL,
    { kind: ElementEnum.MEAT, inherentCount: 2, areaId: AreaIdEnum.MAMMAL_ELEMENT },
  ],
  [
    AnimalEnum.REPTILE,
    { kind: ElementEnum.SUN, inherentCount: 2, areaId: AreaIdEnum.REPTILE_ELEMENT },
  ],
] as const);
