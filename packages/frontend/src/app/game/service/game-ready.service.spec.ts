import { TestBed } from '@angular/core/testing';

import { GameReadyService } from './game-ready.service';

describe('GameReadyService', () => {
  let service: GameReadyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameReadyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
