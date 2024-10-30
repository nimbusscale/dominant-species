import { TestBed } from '@angular/core/testing';

import { GameStateInitializationService } from '../../../../app/engine/service/game-state/game-state-initialization.service';

describe('GameStateInitializationService', () => {
  let service: GameStateInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
