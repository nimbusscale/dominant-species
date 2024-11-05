import { AnimalElements } from '../../../app/game/model/animal.model';
import { Space } from '../../../app/engine/model/space.model';
import { Area } from '../../../app/engine/model/area.model';
import { AreaIdEnum, SpaceKindEnum } from '../../../app/game/constant/area.constant';
import { defaultPieceFactory } from '../../../app/engine/model/piece.model';
import { ElementEnum } from '../../../app/game/constant/element.constant';
import { getOrThrow } from '../../../app/engine/util/misc';
import { elementConfigByAnimal } from '../../../app/game/constant/element-config.constant';
import { AnimalEnum } from '../../../app/game/constant/animal.constant';
import { ElementPiece } from '../../../app/game/model/element.model';

describe('AnimalElements', () => {
  let animalElements: AnimalElements;
  let testSpaces: Space[];
  let testArea: Area;

  beforeEach(() => {
    testSpaces = Array.from({ length: 6 }, () => new Space({kind: SpaceKindEnum.ELEMENT, piece: null}));
    // inherent elements /
    testSpaces[0].addPiece(defaultPieceFactory(ElementEnum.SEED));
    testSpaces[1].addPiece(defaultPieceFactory(ElementEnum.SEED));
    testArea = new Area(AreaIdEnum.BIRD_ELEMENT, testSpaces);
    animalElements = new AnimalElements(
      testArea,
      getOrThrow(elementConfigByAnimal, AnimalEnum.BIRD),
    );
  });
  describe('addElement', () => {
    it('can add element', () => {
      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      expect(testArea.spaces[2].piece?.kind).toEqual(ElementEnum.SUN);
    });
    it('can add element at next available space ', () => {
      testArea.spaces[3].addPiece(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);

      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      expect(testArea.spaces[2].piece?.kind).toEqual(ElementEnum.SUN);
      expect(testArea.spaces[3].piece?.kind).toEqual(ElementEnum.SUN);
    });
    it('throws error when adding too many elements', () => {
      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      expect(() => {
        animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      }).toThrowError();
    });
  });
  describe('removeElement', () => {
    it('can remove an added element', () => {
      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      animalElements.addElement(defaultPieceFactory(ElementEnum.WATER) as ElementPiece);
      animalElements.removeElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      expect(testArea.spaces[2].piece).toBeNull();
      expect(testArea.spaces[3].piece?.kind).toEqual(ElementEnum.WATER);
    });
    it('throws error when trying to remove an added element it does not have', () => {
      expect(() => {
        animalElements.removeElement(defaultPieceFactory(ElementEnum.WATER) as ElementPiece);
      }).toThrowError();
    });
    it('throws error when trying to remove an added element it does not have (matching inherent)', () => {
      expect(() => {
        animalElements.removeElement(defaultPieceFactory(ElementEnum.SEED) as ElementPiece);
      }).toThrowError();
    });
  });

  describe('addedElements', () => {
    it('returns added Elements', () => {
      animalElements.addElement(defaultPieceFactory(ElementEnum.SEED) as ElementPiece);
      animalElements.addElement(defaultPieceFactory(ElementEnum.SUN) as ElementPiece);
      expect(animalElements.addedElements).toEqual([
        defaultPieceFactory(ElementEnum.SEED) as ElementPiece,
        defaultPieceFactory(ElementEnum.SUN) as ElementPiece,
      ]);
    });
  });
});
