import { TestBed } from '@angular/core/testing';

import { PlayerService } from '../../../../app/engine/service/game-management/player.service';
import { AuthService } from '../../../../app/engine/service/auth/auth.service';
import {GameManagementClientService} from "../../../../app/engine/service/game-management/game-management-client.service";
import {BehaviorSubject, of, skip} from "rxjs";

describe('PlayerService', () => {
  let playerService: PlayerService;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockGameManagementClientService: jasmine.SpyObj<GameManagementClientService>

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [], {
      playerAuthData: {
        username: 'tester1',
        accessToken: 'test',
        accessTokenExpire: 100,
        refreshToken: 'test',
      },
      isLoggedIn$: new BehaviorSubject<boolean>(true).asObservable()
    });
    mockGameManagementClientService = jasmine.createSpyObj('GameManagementClientService',
      ['getLoggedInPlayer', 'findPlayers', 'setFriends'])
    mockGameManagementClientService.getLoggedInPlayer.and.returnValue(Promise.resolve({username: 'tester1', friends: []}));

    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: GameManagementClientService, useValue: mockGameManagementClientService },
      ],
    });
    playerService = TestBed.inject(PlayerService);
  });

  describe('currentPlayer$', () => {
    it('should emit the current player', (done) => {
      playerService.currentPlayer$.pipe(skip(1)).subscribe((player) => {
        expect(player?.username).toEqual('tester1')
        done()
      })
    });
  });
});
