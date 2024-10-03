import { TestBed } from '@angular/core/testing';

import { GameStateClientService } from './game-state-client.service';

describe('GameStateClientService', () => {
  let service: GameStateClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
