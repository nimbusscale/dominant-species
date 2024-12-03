import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GameReadyService } from '../../../app/game/service/game-ready.service';
import { GameService } from '../../../app/engine/service/game-management/game.service';
import { NavigateService } from '../../../app/engine/service/navigate.service';
import { DominantSpeciesGameComponent } from '../../../app/game/component/dominant-species-game/dominant-species-game.component';
import { Component } from '@angular/core';
import { DrawPoolGameComponent } from '../../../app/game/component/draw-pool-game/draw-pool-game.component';

@Component({
  selector: 'app-draw-pool-game',
  template: '',
  standalone: true,
})
export class MockDrawPoolGameComponent {}

describe('DominantSpeciesGameComponent', () => {
  let mockGameService: jasmine.SpyObj<GameService>;
  let mockNavigateService: jasmine.SpyObj<NavigateService>;
  let mockGameReadyService: jasmine.SpyObj<GameReadyService>;

  beforeEach(async () => {
    mockGameService = jasmine.createSpyObj('GameService', ['initializeGame', 'cleanupGame']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toLobbyPage']);
    mockGameReadyService = jasmine.createSpyObj('GameReadyService', [], {
      ready$: of(true),
    });

    await TestBed.configureTestingModule({
      imports: [DominantSpeciesGameComponent],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: NavigateService, useValue: mockNavigateService },
        { provide: GameReadyService, useValue: mockGameReadyService },
        provideRouter([
          {
            path: 'game',
            component: DominantSpeciesGameComponent,
          },
        ]),
      ],
    })
      .overrideComponent(DominantSpeciesGameComponent, {
        remove: { imports: [DrawPoolGameComponent] }, // Ensure it replaces
        add: { imports: [MockDrawPoolGameComponent] }, // Replace with mock
      })
      .compileComponents();
  });

  it('should navigate to the lobby page if gameId is missing', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/game');
    expect(mockNavigateService.toLobbyPage).toHaveBeenCalled();
  });

  it('should initialize the game if gameId is provided', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/game?gameId=testGameId');
    expect(mockGameService.initializeGame).toHaveBeenCalledWith('testGameId');
  });

  it('should set gameReady to true when the game is ready', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/game?gameId=testGameId',
      DominantSpeciesGameComponent,
    );
    expect(component.gameReady()).toBeTrue();
  });

  it('should call cleanupGame on destroy', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/game?gameId=testGameId',
      DominantSpeciesGameComponent,
    );
    component.ngOnDestroy();
    expect(mockGameService.cleanupGame).toHaveBeenCalled();
  });
});
