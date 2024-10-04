import { TestBed } from '@angular/core/testing';
import { GameStateService } from '../../../app/engine/service/game-state.service';
import { of } from 'rxjs';
import { GameStateStoreService } from '../../../app/engine/service/game-state-store.service';
import { GameStatePatchService } from '../../../app/engine/service/game-state-patch.service';
import { GameStateClientService } from '../../../app/engine/service/game-state-client.service';
import { testGameStatePatch1 } from './game-state-test.constant';

describe('GameStateService', () => {
  let gameStateService: GameStateService;
  let gameStateStoreMock: jasmine.SpyObj<GameStateStoreService>;
  let gspServiceMock: jasmine.SpyObj<GameStatePatchService>;
  let gameStateClientMock: jasmine.SpyObj<GameStateClientService>;

  beforeEach(() => {
    gameStateStoreMock = jasmine.createSpyObj('GameStateStoreService', [
      'gameState',
      'setGameState',
      'transactionState',
      'commitTransaction',
    ]);
    gspServiceMock = jasmine.createSpyObj('GameStatePatchService', ['apply', 'create']);
    gameStateClientMock = jasmine.createSpyObj('GameStateClientService', ['sendGspToBackend'], {
      gsp$: of({
        timeStamp: Date.now(),
        patch: [
          { op: 'remove', path: '/pile/1' },
          { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
        ],
      }),
    });

    TestBed.configureTestingModule({
      providers: [
        GameStateService,
        { provide: GameStateStoreService, useValue: gameStateStoreMock },
        { provide: GameStatePatchService, useValue: gspServiceMock },
        { provide: GameStateClientService, useValue: gameStateClientMock },
      ],
    });

    gameStateService = TestBed.inject(GameStateService);
  });

  describe('commitTransaction', () => {
    it('should commit along with creating and sending GSP', () => {
      Object.defineProperty(gameStateStoreMock, 'gameState', {
        get: () => true,
      });
      Object.defineProperty(gameStateStoreMock, 'transactionState', {
        get: () => true,
      });
      gspServiceMock.create.and.returnValue(testGameStatePatch1);

      gameStateService.commitTransaction();
      expect(gameStateStoreMock.commitTransaction).toHaveBeenCalled()
      expect(gameStateClientMock.sendGspToBackend).toHaveBeenCalledWith(testGameStatePatch1)
    });
    it('throws error when GameStateStore not initialized', () => {
      Object.defineProperty(gameStateStoreMock, 'gameState', {
        get: () => false,
      });
      expect(() => {gameStateService.commitTransaction()}).toThrowError()
    });
    it('throws error when no transaction to commit', () => {
      Object.defineProperty(gameStateStoreMock, 'gameState', {
        get: () => true,
      });
      Object.defineProperty(gameStateStoreMock, 'transactionState', {
        get: () => false,
      });
      expect(() => {gameStateService.commitTransaction()}).toThrowError()
    });
  });
});
