import { TestBed } from '@angular/core/testing';
import { GameManagementClientService } from '../../../../app/engine/service/game-management/game-management-client.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {CognitoIdentityProviderClient} from "@aws-sdk/client-cognito-identity-provider";

describe('GameManagementClientService', () => {
  let gameManagementClientService: GameManagementClientService;
  let cognitoClientSpy: jasmine.SpyObj<CognitoIdentityProviderClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withFetch()), provideHttpClientTesting(),
      { provide: CognitoIdentityProviderClient, useValue: cognitoClientSpy }],
    });
    gameManagementClientService = TestBed.inject(GameManagementClientService);
  });

  // just a wrapper to HttpClient, so creation test is fine.
  it('should be created', () => {
    expect(gameManagementClientService).toBeTruthy();
  });
});
