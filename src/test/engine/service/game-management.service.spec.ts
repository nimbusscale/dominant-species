import { TestBed } from '@angular/core/testing';

import { GameManagementService } from '../../../app/engine/service/game-management.service';

describe('GameManagementService', () => {
  let service: GameManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
