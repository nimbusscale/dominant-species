import { TestBed } from '@angular/core/testing';
import { GameManagementClientService } from '../../../../app/engine/service/game-management/game-management-client.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GameManagementClientService', () => {
  let gameManagementClientService: GameManagementClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withFetch()), provideHttpClientTesting()],
    });
    gameManagementClientService = TestBed.inject(GameManagementClientService);
  });

  it('should be created', () => {
    expect(gameManagementClientService).toBeTruthy();
  });
});
