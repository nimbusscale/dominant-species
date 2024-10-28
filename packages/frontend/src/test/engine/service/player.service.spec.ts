import { TestBed } from '@angular/core/testing';

import { PlayerService } from '../../../app/engine/service/game-management/player.service';
import { AuthService } from '../../../app/engine/service/auth/auth.service';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [], {
      playerAuthData: {
        username: 'tester1',
        accessToken: 'test',
        accessTokenExpire: 100,
        refreshToken: 'test',
      },
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    playerService = TestBed.inject(PlayerService);
  });

  describe('currentPlayer', () => {
    it('should return the current player', () => {
      expect(playerService.currentPlayer.id).toEqual('tester1');
    });
  });
});
