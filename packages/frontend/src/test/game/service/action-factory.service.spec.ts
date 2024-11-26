import { TestBed } from '@angular/core/testing';

import { ActionFactoryService } from '../../../app/game/service/action-factory.service';

describe('ActionFactoryService', () => {
  let service: ActionFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
