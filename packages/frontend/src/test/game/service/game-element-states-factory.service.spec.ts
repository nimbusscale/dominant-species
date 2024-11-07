import { GameElementStatesFactoryService } from '../../../app/game/service/game-element-states-factory.service';
import { GameElementStates, PileState } from 'api-types/src/game-state';
import { startCase } from 'lodash';
import { AreaIdEnum, SpaceKindEnum } from '../../../app/game/constant/area.constant';
import { PileIdEnum } from '../../../app/game/constant/pile.constant';

describe('GameElementStatesFactoryService', () => {
  let gameElementStatesFactoryServiceService: GameElementStatesFactoryService;
  let gameElementStates: GameElementStates;
  const testPlayerIds = ['tester1', 'tester2', 'tester3'];

  beforeEach(() => {
    gameElementStatesFactoryServiceService = new GameElementStatesFactoryService();
    gameElementStates = gameElementStatesFactoryServiceService.build(testPlayerIds);
  });

  describe('ElementDrawPool', () => {
    it('is created and added to state', () => {
      expect(gameElementStates.pile.find((pile) => pile.id === (PileIdEnum.ELEMENT as string)));
    });
  });
  describe('Factions', () => {
    it('creates Element AreaStates', () => {
      // Includes an Element area for each animal
      expect(
        gameElementStates.area.map((area) => area.id).filter((areaId) => areaId.endsWith('Element'))
          .length,
      ).toEqual(3);
    });
    it('creates FactionStates', () => {
      expect(gameElementStates.faction.length).toEqual(3);
      gameElementStates.faction.forEach((faction) => {
        expect(faction.name === startCase(faction.id)).toBeTrue();
        expect(testPlayerIds.includes(faction.ownerId)).toBeTrue();
      });
    });
    it('creates actionPawn PileStates', () => {
      expect(
        gameElementStates.pile
          .map((pile) => pile.id)
          .filter((pile) => pile.startsWith('actionPawn')).length,
      ).toEqual(3);
      expect(gameElementStates.pile.find((pile) => pile.id.startsWith('actionPawn'))).toEqual(
        jasmine.objectContaining<PileState>({
          inventory: {
            actionPawn: 6,
          },
        }),
      );
    });
    it('creates species PileStates', () => {
      expect(
        gameElementStates.pile.map((pile) => pile.id).filter((pile) => pile.startsWith('species'))
          .length,
      ).toEqual(3);
      expect(gameElementStates.pile.find((pile) => pile.id.startsWith('species'))).toEqual(
        jasmine.objectContaining<PileState>({
          inventory: {
            species: 50,
          },
        }),
      );
    });
  });
  describe('ActionDisplay', () => {
    describe('AdaptionActionDisplay', () => {
      it('is seeded with elements from draw pool', () => {
        const adaptionActionDisplayArea = gameElementStates.area.find(
          (area) => area.id === (AreaIdEnum.ACTION_DISPLAY_ADAPTION as string),
        );
        expect(adaptionActionDisplayArea).toBeTruthy();
        if (adaptionActionDisplayArea) {
          // Ensure the 4 Element spaces have a piece in each of them
          expect(
            adaptionActionDisplayArea.space
              .filter((space) => space.kind === (SpaceKindEnum.ELEMENT as string))
              .map((space) => space.piece)
              .filter((piece) => piece !== null).length,
          ).toEqual(4);
        }
      });
    });
  });
});
