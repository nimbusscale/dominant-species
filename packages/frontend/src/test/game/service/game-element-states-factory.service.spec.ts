import { GameElementStatesFactoryService } from '../../../app/game/service/game-element-states-factory.service';
import { GameElementStates, PileState } from 'api-types/src/game-state';
import { startCase } from 'lodash';

describe('GameElementStatesFactoryService', () => {
  let gameElementStatesFactoryServiceService: GameElementStatesFactoryService;
  let gameElementStates: GameElementStates;
  const testPlayerIds = ['tester1', 'tester2', 'tester3'];

  beforeEach(() => {
    gameElementStatesFactoryServiceService = new GameElementStatesFactoryService();
    gameElementStates = gameElementStatesFactoryServiceService.build(testPlayerIds);
  });

  describe('build', () => {
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
});
