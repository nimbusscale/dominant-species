import { TestBed } from '@angular/core/testing';

import { PileRegistryService } from '../../../app/engine/service/pile-registry.service';

describe('PileRegistryService', () => {
  let service: PileRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PileRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
