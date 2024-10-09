import { TestBed } from '@angular/core/testing';

import { PileStateService } from '../../../app/engine/service/pile-state.service';

describe('PileStateService', () => {
  let service: PileStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PileStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
