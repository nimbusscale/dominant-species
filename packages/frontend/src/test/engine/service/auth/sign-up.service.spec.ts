import { TestBed } from '@angular/core/testing';

import { SignUpService } from '../../../../app/engine/service/auth/sign-up.service';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

describe('SignUpService', () => {
  let service: SignUpService;
  let cognitoClientSpy: jasmine.SpyObj<CognitoIdentityProviderClient>;

  beforeEach(() => {
    cognitoClientSpy = jasmine.createSpyObj('CognitoIdentityProviderClient', ['send']);

    TestBed.configureTestingModule({
      providers: [{ provide: CognitoIdentityProviderClient, useValue: cognitoClientSpy }],
    });
    service = TestBed.inject(SignUpService);
  });

  // SignUpService is just a wrapper to CognitoClientService for now, so checking if creates is fine.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
