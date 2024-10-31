import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from '../../../app/engine/service/local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  // just a wrapper to localStorage, so creation test fine.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
