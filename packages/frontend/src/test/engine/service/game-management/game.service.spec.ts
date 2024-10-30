import { TestBed } from '@angular/core/testing';

import { GameService } from '../../../../app/engine/service/game-management/game.service';
import { AuthService } from '../../../../app/engine/service/auth/auth.service';
import { GameManagementClientService } from '../../../../app/engine/service/game-management/game-management-client.service';
import { Game } from 'api-types/src/game';
import { GameStateInitializationService } from '../../../../app/engine/service/game-state/game-state-initialization.service';
import { GameState } from 'api-types/src/game-state';

describe('GameService', () => {
  let gameService: GameService;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockGameManagementClientService: jasmine.SpyObj<GameManagementClientService>;
  let mockGameStateInitializationService: jasmine.SpyObj<GameStateInitializationService>;
  let mockGameState: jasmine.SpyObj<GameState>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [], {
      loggedInUsername: 'tester1',
    });
    mockGameManagementClientService = jasmine.createSpyObj('GameManagementClientService', [
      'createGame',
      'setInitialGameState',
    ]);
    mockGameState = jasmine.createSpyObj('GameState', [], {
      gameId: 'fake',
    });
    mockGameStateInitializationService = jasmine.createSpyObj('GameStateInitializationService', [
      'build',
    ]);
    mockGameStateInitializationService.build.and.returnValue(mockGameState);

    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: GameManagementClientService, useValue: mockGameManagementClientService },
        { provide: GameStateInitializationService, useValue: mockGameStateInitializationService },
      ],
    });
    gameService = TestBed.inject(GameService);
  });

  describe('createGame', () => {
    it('should create game', async () => {
      await gameService.createGame(['tester2', 'tester3']);
      expect(mockGameManagementClientService.createGame).toHaveBeenCalledWith(
        jasmine.objectContaining({
          host: 'tester1',
          playerIds: ['tester1', 'tester2', 'tester3'],
        }) as unknown as Game,
      );
      expect(mockGameManagementClientService.setInitialGameState).toHaveBeenCalledWith(
        mockGameState,
      );
    });
  });
});
