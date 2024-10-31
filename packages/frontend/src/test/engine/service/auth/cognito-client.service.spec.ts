import { TestBed } from '@angular/core/testing';
import {
  CognitoIdentityProviderClient,
  AuthenticationResultType,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoClientService } from '../../../../app/engine/service/auth/cognito-client.service';

describe('CognitoClientService', () => {
  let service: CognitoClientService;
  let cognitoClientSpy: jasmine.SpyObj<CognitoIdentityProviderClient>;

  beforeEach(() => {
    cognitoClientSpy = jasmine.createSpyObj('CognitoIdentityProviderClient', ['send']);

    TestBed.configureTestingModule({
      providers: [
        CognitoClientService,
        { provide: CognitoIdentityProviderClient, useValue: cognitoClientSpy },
      ],
    });

    service = TestBed.inject(CognitoClientService);
  });

  describe('login', () => {
    it('should return AuthenticationResult on successful login', async () => {
      const authResult: AuthenticationResultType = {
        AccessToken: 'access',
        IdToken: 'id',
        RefreshToken: 'refresh',
      };

      cognitoClientSpy.send.and.returnValue(
        Promise.resolve({ AuthenticationResult: authResult }) as any,
      );

      const result = await service.login('testUser', 'testPassword');
      expect(result).toEqual(authResult);
    });

    it('should return null on login failure', async () => {
      cognitoClientSpy.send.and.returnValue(Promise.resolve({ AuthenticationResult: null }) as any);

      const result = await service.login('testUser', 'wrongPassword');
      expect(result).toBeNull();
    });

    it('should return null and log error if login throws', async () => {
      spyOn(console, 'error');
      cognitoClientSpy.send.and.throwError('Login failed');

      const result = await service.login('testUser', 'testPassword');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should return true on successful sign up', async () => {
      cognitoClientSpy.send.and.returnValue(Promise.resolve({}) as any);

      const result = await service.signUp('testUser', 'test@example.com', 'password123');
      expect(result).toBeTrue();
    });

    it('should return false and log error on sign up failure', async () => {
      spyOn(console, 'error');
      cognitoClientSpy.send.and.throwError('Sign up failed');

      const result = await service.signUp('testUser', 'test@example.com', 'password123');
      expect(result).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('confirmSignUp', () => {
    it('should return true on successful confirmation', async () => {
      cognitoClientSpy.send.and.returnValue(Promise.resolve({}) as any);

      const result = await service.confirmSignUp('testUser', '123456');
      expect(result).toBeTrue();
    });

    it('should return false and log error on confirmation failure', async () => {
      spyOn(console, 'error');
      cognitoClientSpy.send.and.throwError('Confirmation failed');

      const result = await service.confirmSignUp('testUser', '123456');
      expect(result).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
