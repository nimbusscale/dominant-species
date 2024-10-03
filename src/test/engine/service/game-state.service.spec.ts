import { TestBed } from '@angular/core/testing';
import { GameStateService } from '../../../app/engine/service/game-state.service';
import { of } from 'rxjs';
import { GameStateStoreService } from '../../../app/engine/service/game-state-store.service';
import { GameStatePatchService } from '../../../app/engine/service/game-state-patch.service';
import { GameStateClientService } from '../../../app/engine/service/game-state-client.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    const gameStateStoreMock: jasmine.SpyObj<GameStateStoreService> = jasmine.createSpyObj(
      'GameStateStoreService',
      ['gameState', 'setGameState'],
    );
    const gspServiceMock: jasmine.SpyObj<GameStatePatchService> = jasmine.createSpyObj(
      'GameStatePatchService',
      ['apply'],
    );
    const gameStateClientMock: jasmine.SpyObj<GameStateClientService> = jasmine.createSpyObj(
      'GameStateClientService',
      [],
      {
        gsp$: of({
          timeStamp: Date.now(),
          patch: [
            { op: 'remove', path: '/pile/1' },
            { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
          ],
        }),
      },
    );

    TestBed.configureTestingModule({
      providers: [
        GameStateService,
        { provide: GameStateStoreService, useValue: gameStateStoreMock },
        { provide: GameStatePatchService, useValue: gspServiceMock },
        { provide: GameStateClientService, useValue: gameStateClientMock },
      ],
    });

    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
