import { TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { GameReadyService } from '../../../app/game/service/game-ready.service';
import { GameStateService } from '../../../app/engine/service/game-state/game-state.service';
import { ElementDrawPoolService } from '../../../app/game/service/element-draw-pool.service';
import { AnimalProviderService } from '../../../app/game/service/animal-provider.service';
import { ActionDisplayManagerService } from '../../../app/game/service/action-display/action-display-manager.service';
import { Animal } from '../../../app/game/model/animal.model';
import { PlayerService } from '../../../app/engine/service/game-management/player.service';
import { Player } from 'api-types/src/player';

describe('GameReadyService', () => {
  let gameReadyService: GameReadyService;
  let playerServiceMock: jasmine.SpyObj<PlayerService>;
  let gameStateServiceMock: jasmine.SpyObj<GameStateService>;
  let elementDrawPoolServiceMock: jasmine.SpyObj<ElementDrawPoolService>;
  let animalProviderServiceMock: jasmine.SpyObj<AnimalProviderService>;
  let actionDisplayManagerServiceMock: jasmine.SpyObj<ActionDisplayManagerService>;
  let animalsSubject: BehaviorSubject<Animal[]>;

  beforeEach(() => {
    playerServiceMock = jasmine.createSpyObj([], {
      currentPlayer$: of(jasmine.createSpyObj<Player>(['username'])),
    });
    gameStateServiceMock = jasmine.createSpyObj([], {
      playerIds: ['player1', 'player2'],
    });
    elementDrawPoolServiceMock = jasmine.createSpyObj([], {
      ready$: of(true),
    });

    animalsSubject = new BehaviorSubject<Animal[]>([]);
    animalProviderServiceMock = jasmine.createSpyObj([], {
      animals$: animalsSubject.asObservable(),
    });
    actionDisplayManagerServiceMock = jasmine.createSpyObj([], {
      ready$: of(true),
    });

    TestBed.configureTestingModule({
      providers: [
        GameReadyService,
        { provide: PlayerService, useValue: playerServiceMock },
        { provide: GameStateService, useValue: gameStateServiceMock },
        { provide: ElementDrawPoolService, useValue: elementDrawPoolServiceMock },
        { provide: AnimalProviderService, useValue: animalProviderServiceMock },
        { provide: ActionDisplayManagerService, useValue: actionDisplayManagerServiceMock },
      ],
    });

    gameReadyService = TestBed.inject(GameReadyService);
  });

  it('should initialize ready$ as an Observable', (done) => {
    gameReadyService.ready$.subscribe((ready) => {
      expect(ready).toBeFalse(); // Initially, ready should be false
      done();
    });
  });

  it('should set ready$ to true when all services are ready', (done) => {
    // Emit animals matching playerIds length
    animalsSubject.next([
      jasmine.createSpyObj<Animal>(['id']),
      jasmine.createSpyObj<Animal>(['id']),
    ]);

    gameReadyService.ready$.subscribe((ready) => {
      expect(ready).toBeTrue();
      done();
    });
  });
});
