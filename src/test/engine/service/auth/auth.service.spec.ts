import { TestBed } from '@angular/core/testing';

import { AuthService } from '../../../../app/engine/service/auth/auth.service';

describe('LoginService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
