import { TestBed } from '@angular/core/testing';
import { GameElementStates, GameState } from 'api-types/src/game-state';
import { GameStateInitializationService } from '../../../../app/engine/service/game-state/game-state-initialization.service';
import {
  InitialGameElementStatesFactory,
  InitialGameElementStatesFactoryConstructor,
} from '../../../../app/engine/model/game-state.model';
import { GameTitle } from '../../../../app/engine/constant/game-title.constant';
import { testGameElementsStates } from '../../../game-state-test.constant';

class MockGameElementStatesFactory implements InitialGameElementStatesFactory {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build(playerIds: string[]): GameElementStates {
    return testGameElementsStates;
  }
}

describe('GameStateInitializationService', () => {
  let service: GameStateInitializationService;
  let mockFactoryMap: Map<string, InitialGameElementStatesFactoryConstructor>;

  beforeEach(() => {
    mockFactoryMap = new Map([[GameTitle.DOMINANT_SPECIES, MockGameElementStatesFactory]]);

    TestBed.configureTestingModule({
      providers: [
        GameStateInitializationService,
        { provide: 'FACTORY_MAP', useValue: mockFactoryMap },
      ],
    });

    service = TestBed.inject(GameStateInitializationService);
  });

  it('should build game state with the provided factory for a known game title', () => {
    const gameId = 'game1';
    const playerIds = ['player1', 'player2'];
    const result: GameState = service.build(GameTitle.DOMINANT_SPECIES, gameId, playerIds);

    expect(result.gameElements).toEqual(testGameElementsStates);
    expect(result.gameId).toBe(gameId);
    expect(result.playerIds).toEqual(playerIds);
  });

  it('should throw an error if the game title is not supported', () => {
    const unsupportedTitle = 'UNKNOWN_GAME_TITLE';
    const gameId = 'game2';
    const playerIds = ['player1', 'player2'];

    expect(() => service.build(unsupportedTitle, gameId, playerIds)).toThrowError(
      `Unable to build initial state for ${unsupportedTitle}`,
    );
  });
});
