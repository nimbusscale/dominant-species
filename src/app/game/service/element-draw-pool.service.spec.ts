import { TestBed } from '@angular/core/testing';

import { ElementDrawPoolService } from './element-draw-pool.service';

describe('ElementDrawPoolService', () => {
  let service: ElementDrawPoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementDrawPoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
