import { TestBed } from '@angular/core/testing';

import { GameStateClientService } from '../../../../app/engine/service/game-state/game-state-client.service';
import { AuthService } from '../../../../app/engine/service/auth/auth.service';

describe('GameStateClientService', () => {
  let gameStateClientService: GameStateClientService;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj([], {
      playerAuthData: {
        accessToken: 'test',
        username: 'tester1',
      },
    });

    TestBed.configureTestingModule({
      providers: [GameStateClientService, { provide: AuthService, useValue: authServiceMock }],
    });
    gameStateClientService = TestBed.inject(GameStateClientService);
  });

  it('should be created', () => {
    expect(gameStateClientService).toBeTruthy();
  });
});
