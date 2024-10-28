import { TestBed } from '@angular/core/testing';

import { GameService } from '../../../../app/engine/service/game-management/game.service';
import {AuthService} from "../../../../app/engine/service/auth/auth.service";
import {GameManagementClientService} from "../../../../app/engine/service/game-management/game-management-client.service";


describe('GameService', () => {
  let gameService: GameService;
  let mockAuthService: jasmine.SpyObj<AuthService>
  let mockGameManagementClientService: jasmine.SpyObj<GameManagementClientService>


  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [], {
      loggedInUsername: 'tester1'
    });
    mockGameManagementClientService = jasmine.createSpyObj('GameManagementClientService',
      ['createGame'])


    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: GameManagementClientService, useValue: mockGameManagementClientService },
      ],
    });
    gameService = TestBed.inject(GameService);
  });

  describe('createGame', () => {
    it('should create game', async() => {
      void await gameService.createGame(['tester2', 'tester3'])
      expect(mockGameManagementClientService.createGame).toHaveBeenCalledWith(jasmine.objectContaining({
        host: 'tester1',
        players: ['tester1', 'tester2', 'tester3']
      }))
    })
  })
});
