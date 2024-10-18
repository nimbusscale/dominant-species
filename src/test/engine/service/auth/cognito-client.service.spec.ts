import { TestBed } from '@angular/core/testing';
import { CognitoClientService } from '../../../../app/engine/service/auth/cognito-client.service';

describe('CognitoClientService', () => {
  let service: CognitoClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CognitoClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
