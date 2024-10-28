import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyPageComponent } from '../../../app/engine/component/lobby-page/lobby-page.component';
import { GameService } from '../../../app/engine/service/game-management/game.service';
import { PlayerService } from '../../../app/engine/service/game-management/player.service';
import { testPlayer1 } from '../game-state-test.constant';
import { of } from 'rxjs';
import { G } from '@angular/cdk/keycodes';

describe('LobbyPageComponent', () => {
  let component: LobbyPageComponent;
  let fixture: ComponentFixture<LobbyPageComponent>;
  let mockGameService: jasmine.SpyObj<GameService>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;

  beforeEach(async () => {
    mockGameService = jasmine.createSpyObj<GameService>(
      'GameService',
      ['getGamesForLoggedInPlayer', 'createGame', 'completeGame'],
      {},
    );
    mockPlayerService = jasmine.createSpyObj<PlayerService>('PlayerService', [], {
      currentPlayer$: of(testPlayer1),
    });

    await TestBed.configureTestingModule({
      imports: [LobbyPageComponent],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LobbyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
